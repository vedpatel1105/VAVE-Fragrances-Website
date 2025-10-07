"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, Wallet, AlertCircle, BadgePercent } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/src/lib/cartStore"
import { createRazorpayOrder, initializeRazorpayCheckout } from "@/src/lib/razorpayService"
import type { PaymentVerificationResult } from "@/src/types/orders"
import { supabase } from "@/src/lib/supabaseClient"

import type { ShippingAddress } from "@/src/types/orders";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner"
import { useAuthStore } from "@/src/lib/auth"

export default function Checkout() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { user, isAuthenticated, isLoading } = useAuthStore()
  const { items: cartItems, getTotalPrice: getSubtotalAmount, clearCart } = useCartStore()
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [shippingCharge, setShippingCharge] = useState<number>(0);

  // Protected route - redirect if not logged in (wait for loading)
  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      const currentPath = window.location.pathname;
      router.push(`/auth/login?redirect=${encodeURIComponent(currentPath)}`);
      return;
    }
    if (!isLoading && cartItems.length === 0) {
      router.push("/collection");
    }
  }, [isAuthenticated, isLoading, user, cartItems, router]);

  // Load user's default address if available
  useEffect(() => {
    const loadUserAddress = async () => {
      try {
        if (!user?.id) return;

        const { data: addresses, error } = await supabase
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        if (addresses) {
          setShippingAddress({
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || '',
            address: addresses.address,
            city: addresses.city,
            state: addresses.state,
            pincode: addresses.pincode,
          });
        } else {
          // If no default address, try to pre-fill from user metadata
          setShippingAddress(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error loading address:', error);
        toast({
          title: "Error",
          description: "Failed to load saved address. Please enter manually.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingAddress(false);
      }
    };

    loadUserAddress();
  }, [user, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!shippingAddress[field as keyof ShippingAddress]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        return false;
      }
    }
    return true;
  };

  // Compute shipping based on subtotal
  useEffect(() => {
    const subtotal = getSubtotalAmount();
    setShippingCharge(subtotal < 1000 ? 30 : 0);
  }, [cartItems, getSubtotalAmount]);

  const handleCheckout = async () => {
    try {
      setError("");
      setIsProcessing(true);

      if (!validateForm()) {
        setIsProcessing(false);
        return;
      }

      // Create order object for Razorpay. Backend will recompute subtotal and shipping charge
      const order = {
        items: cartItems.map(item => ({
          product_id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? "",
          image: item.image,
        })),
        total: getSubtotalAmount() + shippingCharge,
        shipping_address: shippingAddress,
        payment_method: 'razorpay' as const,
      };

      // Initialize Razorpay order
      const razorpayOrder = await createRazorpayOrder(order);
      
      await initializeRazorpayCheckout(
        razorpayOrder,
        shippingAddress,
        // Success callback
        async (verificationData: PaymentVerificationResult) => {
          // Clear cart
          clearCart();
          
          // Save address if user is logged in
          if (user?.id) {
            const { error: addressError } = await supabase
              .from('user_addresses')
              .upsert({
                user_id: user.id,
                type: 'shipping',
                ...shippingAddress,
                is_default: true,
              });

            if (addressError) {
              console.error('Error saving address:', addressError);
            }
          }

          // Show success message
          toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase.",
          });

          // Redirect to order success page with the database order ID from verification response
          router.push(`/order-success?orderId=${verificationData.orderId}`);
        },
        // Error callback
        (error) => {
          setError(error.message || "Payment failed. Please try again.");
          setIsProcessing(false);
        }
      );
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : "An error occurred during checkout");
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>

          {isLoading && (
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          )}

          {!isLoading && error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500 rounded-lg p-4 mb-6 flex items-center gap-3"
            >
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Information */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 space-y-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Shipping Information
                  </h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={shippingAddress.name}
                          onChange={handleInputChange}
                          className="bg-white/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={shippingAddress.email}
                          onChange={handleInputChange}
                          className="bg-white/5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={shippingAddress.phone}
                        onChange={handleInputChange}
                        className="bg-white/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={shippingAddress.address}
                        onChange={handleInputChange}
                        className="bg-white/5"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          name="city"
                          value={shippingAddress.city}
                          onChange={handleInputChange}
                          className="bg-white/5"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          name="state"
                          value={shippingAddress.state}
                          onChange={handleInputChange}
                          className="bg-white/5"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input
                        id="pincode"
                        name="pincode"
                        value={shippingAddress.pincode}
                        onChange={handleInputChange}
                        className="bg-white/5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={`${item.id}-${item.size}`} className="flex items-center gap-4">
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-400">
                            {item.size}ml × {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">₹{item.price * item.quantity}</p>
                      </div>
                    ))}

                    <div className="border-t border-white/10 pt-4 mt-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{getSubtotalAmount()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                      </div>
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{getSubtotalAmount() + shippingCharge}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BadgePercent className="h-3 w-3" />
                        <span>GST is included in the displayed prices</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-12 text-lg"
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : `Pay ₹${getSubtotalAmount() + shippingCharge}`}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
