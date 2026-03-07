"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, AlertCircle, BadgePercent, CheckCircle2, Loader2 } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/src/lib/cartStore"
import { createRazorpayOrder, initializeRazorpayCheckout, validateShippingAddress } from "@/src/lib/razorpayService"
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
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()
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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'payment'>('form');

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

        if (error && error.code !== 'PGRST116') {
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
    // Clear field error on change
    if (fieldErrors[name as keyof ShippingAddress]) {
      setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    }
    if (error) setError("");
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!shippingAddress.name.trim()) {
      errors.name = "Full name is required";
    }

    if (!shippingAddress.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shippingAddress.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!shippingAddress.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(shippingAddress.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid 10-digit phone number";
    }

    if (!shippingAddress.address.trim()) {
      errors.address = "Address is required";
    }

    if (!shippingAddress.city.trim()) {
      errors.city = "City is required";
    }

    if (!shippingAddress.state.trim()) {
      errors.state = "State is required";
    }

    if (!shippingAddress.pincode.trim()) {
      errors.pincode = "PIN Code is required";
    } else if (!/^\d{6}$/.test(shippingAddress.pincode)) {
      errors.pincode = "Please enter a valid 6-digit PIN code";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Compute shipping based on subtotal
  useEffect(() => {
    const subtotal = getSubtotalAmount();
    setShippingCharge(subtotal < 1000 ? 30 : 0);
  }, [cartItems, getSubtotalAmount]);

  const handleCheckout = async () => {
    try {
      setError("");

      if (!validateForm()) {
        return;
      }

      // Re-check auth before payment
      await checkAuth();
      if (!isAuthenticated) {
        toast({
          title: "Session Expired",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
        });
        router.push(`/auth/login?redirect=/checkout`);
        return;
      }

      setIsProcessing(true);
      setPaymentStep('processing');

      // Create order object for Razorpay
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

      const razorpayOrder = await createRazorpayOrder(order);
      setPaymentStep('payment');

      await initializeRazorpayCheckout(
        razorpayOrder,
        shippingAddress,
        // Success callback
        async (verificationData: PaymentVerificationResult) => {
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

          toast({
            title: "Order Placed Successfully!",
            description: "Thank you for your purchase.",
          });

          router.push(`/order-success?orderId=${verificationData.orderId}`);
        },
        // Error callback
        (error) => {
          setError(error.message || "Payment failed. Please try again.");
          setIsProcessing(false);
          setPaymentStep('form');
        }
      );
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : "An error occurred during checkout");
      setIsProcessing(false);
      setPaymentStep('form');
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  // Field helper component
  const FormField = ({
    label,
    name,
    type = "text",
    placeholder = "",
    colSpan = 1,
  }: {
    label: string;
    name: keyof ShippingAddress;
    type?: string;
    placeholder?: string;
    colSpan?: number;
  }) => (
    <div className={`space-y-2 ${colSpan === 2 ? 'col-span-2' : ''}`}>
      <Label htmlFor={name as string}>{label}</Label>
      <div className="relative">
        <Input
          id={name as string}
          name={name as string}
          type={type}
          value={shippingAddress[name]}
          onChange={handleInputChange}
          className={`bg-white/5 ${
            fieldErrors[name]
              ? 'border-red-500 focus:ring-red-500'
              : shippingAddress[name]
              ? 'border-green-500/50'
              : ''
          }`}
          placeholder={placeholder}
          autoComplete={name === 'pincode' ? 'postal-code' : name as string}
        />
        {shippingAddress[name] && !fieldErrors[name] && (
          <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={14} />
        )}
      </div>
      {fieldErrors[name] && (
        <p className="text-xs text-red-400">{fieldErrors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>

          {/* Progress Steps */}
          <div className="flex items-center gap-2 mb-8 text-sm">
            <span className={`flex items-center gap-1 ${paymentStep === 'form' ? 'text-white font-medium' : 'text-green-400'}`}>
              {paymentStep !== 'form' ? <CheckCircle2 className="h-4 w-4" /> : <span className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs">1</span>}
              Details
            </span>
            <div className={`flex-1 h-0.5 ${paymentStep !== 'form' ? 'bg-green-500' : 'bg-white/20'}`} />
            <span className={`flex items-center gap-1 ${paymentStep === 'processing' ? 'text-white font-medium' : paymentStep === 'payment' ? 'text-green-400' : 'text-white/40'}`}>
              {paymentStep === 'payment' ? <CheckCircle2 className="h-4 w-4" /> : <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${paymentStep === 'processing' ? 'border-white' : 'border-white/40'}`}>2</span>}
              Processing
            </span>
            <div className={`flex-1 h-0.5 ${paymentStep === 'payment' ? 'bg-green-500' : 'bg-white/20'}`} />
            <span className={`flex items-center gap-1 ${paymentStep === 'payment' ? 'text-white font-medium' : 'text-white/40'}`}>
              <span className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs ${paymentStep === 'payment' ? 'border-white' : 'border-white/40'}`}>3</span>
              Payment
            </span>
          </div>

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
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
              <p className="text-red-500">{error}</p>
            </motion.div>
          )}

          {/* Processing Overlay */}
          {paymentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center"
            >
              <div className="text-center">
                <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-lg font-medium">Creating your order...</p>
                <p className="text-white/60 text-sm mt-1">Please don&apos;t close this page</p>
              </div>
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

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="Full Name" name="name" placeholder="Your full name" />
                    <FormField label="Email" name="email" type="email" placeholder="name@example.com" />
                  </div>

                  <FormField label="Phone Number" name="phone" placeholder="10-digit phone number" />
                  <FormField label="Address" name="address" placeholder="Street address, apartment, etc." />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField label="City" name="city" placeholder="City" />
                    <FormField label="State" name="state" placeholder="State" />
                  </div>

                  <FormField label="PIN Code" name="pincode" placeholder="6-digit PIN code" />
                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 sticky top-4">
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
                      <div className="flex justify-between font-medium text-lg pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span>₹{getSubtotalAmount() + shippingCharge}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BadgePercent className="h-3 w-3" />
                        <span>GST is included in the displayed prices</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="w-full h-12 text-lg mt-6"
                    onClick={handleCheckout}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Pay ₹{getSubtotalAmount() + shippingCharge}
                      </span>
                    )}
                  </Button>

                  {shippingCharge > 0 && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Add ₹{1000 - getSubtotalAmount()} more for free shipping
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
