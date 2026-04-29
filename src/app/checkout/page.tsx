"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { CreditCard, Truck, AlertCircle, BadgePercent, CheckCircle2, Loader2, MessageCircle } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"
import { useCartStore } from "@/src/lib/cartStore"
import { createRazorpayOrder, initializeRazorpayCheckout, validateShippingAddress } from "@/src/lib/razorpayService"
import type { PaymentVerificationResult } from "@/src/types/orders"
import { getSupabaseClient } from "@/src/lib/supabaseClient"
import { useSearchParams } from "next/navigation"
import { ProductInfo } from "@/src/data/product-info"

import { LoadingSpinner } from "@/src/components/ui/loading-spinner"
import type { ShippingAddress } from "@/src/types/orders";
import { useAuthStore } from "@/src/lib/auth"
import { analytics } from "@/src/lib/analytics"
import { notificationService } from "@/src/lib/notificationService"
import { couponService, type Coupon } from "@/src/lib/couponService"

// Field helper component - Defined outside to prevent focus loss on re-render
const FormField = ({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
  placeholder = "",
  colSpan = 1,
}: {
  label: string;
  name: keyof ShippingAddress;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
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
        value={value}
        onChange={onChange}
        className={`bg-white/5 ${error
            ? 'border-red-500 focus:ring-red-500'
            : value
              ? 'border-green-500/50'
              : ''
          }`}
        placeholder={placeholder}
        autoComplete={name === 'pincode' ? 'postal-code' : name as string}
      />
      {value && !error && (
        <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={14} />
      )}
    </div>
    {error && (
      <p className="text-xs text-red-400">{error}</p>
    )}
  </div>
);

function CheckoutContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore()
  const { items: cartItems, getTotalPrice: getSubtotalAmount, clearCart } = useCartStore()
  
  const searchParams = useSearchParams()
  const productIdParam = searchParams.get('productId')
  const sizeParam = searchParams.get('size')
  const quantityParam = searchParams.get('quantity') || '1'

  const [checkoutItems, setCheckoutItems] = useState<any[]>([])
  const [isDirectBuy, setIsDirectBuy] = useState(false)
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ShippingAddress, string>>>({});
  const [isLoadingAddress, setIsLoadingAddress] = useState(true);
  const [shippingCharge, setShippingCharge] = useState<number>(0);
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'payment'>('form');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | 'new'>('new');

  // Coupon State
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Success Modal State
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successOrderId, setSuccessOrderId] = useState("");
  const [processingTime, setProcessingTime] = useState(0);
  
  // Timer for processing state
  useEffect(() => {
    let interval: any;
    if (paymentStep === 'processing' && isProcessing) {
      interval = setInterval(() => {
        setProcessingTime(prev => prev + 1);
      }, 1000);
    } else {
      setProcessingTime(0);
    }
    return () => clearInterval(interval);
  }, [paymentStep, isProcessing]);
  const [processingTimeout, setProcessingTimeout] = useState<any>(null);

  // Save Address State
  const [saveAddressForFuture, setSaveAddressForFuture] = useState(true);

  // Initialize checkout items
  useEffect(() => {
    if (isLoading) return;

    if (productIdParam && sizeParam) {
      const product = ProductInfo.allProductItems.find(p => p.id.toString() === productIdParam || p.id === Number(productIdParam));
      if (product) {
        const sizeOption = product.sizeOptions.find(s => s.size === sizeParam);
        const price = sizeOption ? sizeOption.price : product.price;
        const image = product.images[sizeParam as "30" | "50"] ? product.images[sizeParam as "30" | "50"][0] : product.images["30"][0];
        
        setCheckoutItems([{
          product_id: product.id.toString(),
          name: product.name,
          price: price,
          image: image,
          quantity: Number(quantityParam),
          size: sizeParam
        }]);
        setIsDirectBuy(true);
      } else {
        // Product not found in list yet, wait or fallback
        if (cartItems.length > 0) {
          setCheckoutItems(cartItems);
          setIsDirectBuy(false);
        } else {
          // If no product and no cart, redirect
          router.push("/collection");
        }
      }
    } else if (cartItems.length > 0) {
      setCheckoutItems(cartItems);
      setIsDirectBuy(false);
    } else {
      // Nothing in cart and no direct buy
      router.push("/collection");
    }
  }, [isLoading, cartItems, productIdParam, sizeParam, quantityParam, router]);

  // Compute subtotal
  const subtotalAmount = useMemo(() => {
    return checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }, [checkoutItems]);

  // Track beginning of checkout
  useEffect(() => {
    if (checkoutItems.length > 0) {
      analytics.trackEvent('begin_checkout', {
        items: checkoutItems.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
        total: subtotalAmount
      });
    }
  }, [checkoutItems.length, subtotalAmount]);

  // Handle Razorpay Redirect Fallback
  useEffect(() => {
    const paymentId = searchParams.get('razorpay_payment_id');
    const orderId = searchParams.get('razorpay_order_id');
    const signature = searchParams.get('razorpay_signature');
    const errorDesc = searchParams.get('error[description]') || searchParams.get('error_description');

    if (errorDesc) {
      setError(errorDesc);
      setPaymentStep('form');
      setIsProcessing(false);
    } else if (paymentId && orderId && signature) {
      // It's a success redirect! We should verify it.
      // Assuming we rely on the normal flow. If the user was redirected, we might need a separate verify function here.
      // But typically, the callback handles it. Just in case, if the page was freshly loaded with these params:
      setPaymentStep('processing');
      setIsProcessing(true);
      
      const verifyRedirect = async () => {
        try {
          const client = getSupabaseClient();
          const { data: { session } } = await client.auth.getSession();
          
          const verificationHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
          };
          if (session?.access_token) {
            verificationHeaders['Authorization'] = `Bearer ${session.access_token}`;
          }

          const response = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: verificationHeaders,
            body: JSON.stringify({
              razorpay_order_id: orderId,
              razorpay_payment_id: paymentId,
              razorpay_signature: signature,
            }),
          });

          const data = await response.json();
          if (!response.ok) throw new Error(data.error || 'Payment verification failed');
          
          clearCart();
          setPaymentStep('form');
          setIsProcessing(false);
          setSuccessOrderId(data.orderId);
          setShowSuccessModal(true);
        } catch (err: any) {
          setError(err.message || "Payment verification failed");
          setPaymentStep('form');
          setIsProcessing(false);
        }
      };
      
      verifyRedirect();
    }
  }, [searchParams]);

  // Load user's saved addresses if available
  useEffect(() => {
    if (!user?.id) {
      setIsLoadingAddress(false);
      return;
    }

    const loadUserAddresses = async () => {
      try {
        const client = getSupabaseClient()
        const { data: addresses, error } = await client
          .from('user_addresses')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false });

        if (error) throw error;

        if (addresses && addresses.length > 0) {
          setSavedAddresses(addresses);
          const defaultAddr = addresses.find(a => a.is_default) || addresses[0];
          setSelectedAddressId(defaultAddr.id);
          setShippingAddress({
            name: user.user_metadata?.full_name || "",
            email: user.email || "",
            phone: user.user_metadata?.phone || "",
            address: defaultAddr.address,
            city: defaultAddr.city,
            state: defaultAddr.state,
            pincode: defaultAddr.pincode
          });
          
          // If express=true is in URL, skip directly to payment step
          const isExpress = searchParams.get('express') === 'true';
          if (isExpress) {
            setPaymentStep('payment');
          }
        } else {
          setShippingAddress(prev => ({
            ...prev,
            name: user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: user.user_metadata?.phone || ''
          }));
        }
      } catch (error) {
        console.error('Error loading addresses:', error);
      } finally {
        setIsLoadingAddress(false);
      }
    };

    loadUserAddresses();
  }, [user?.id]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingAddress(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error on change
    setFieldErrors(prev => {
      if (prev[name as keyof ShippingAddress]) {
        return { ...prev, [name]: undefined };
      }
      return prev;
    });
    if (error) setError("");
  }, [error]);

  const handleAddressSelect = useCallback((addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') {
      setShippingAddress(prev => ({
        ...prev,
        address: "",
        city: "",
        state: "",
        pincode: ""
      }));
    } else {
      const address = savedAddresses.find(a => a.id === addressId);
      if (address) {
        setShippingAddress(prev => ({
          ...prev,
          address: address.address,
          city: address.city,
          state: address.state,
          pincode: address.pincode
        }));
      }
    }
  }, [savedAddresses]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    setIsValidatingCoupon(true);
    setCouponError("");
    
    try {
      const result = await couponService.validateCoupon(couponCode, subtotalAmount, checkoutItems);
      if (result.success && result.coupon) {
        setAppliedCoupon(result.coupon);
        const discount = couponService.calculateDiscount(result.coupon, checkoutItems);
        setDiscountAmount(discount);
        toast({
          title: "Coupon Applied",
          description: `${result.coupon.code} applied successfully!`,
        });
      } else {
        setCouponError(result.error || "Failed to validate coupon");
      }
    } catch (err) {
      setCouponError("An error occurred");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode("");
    setCouponError("");
  };

  // Recalculate discount if items change
  useEffect(() => {
    if (appliedCoupon) {
      const discount = couponService.calculateDiscount(appliedCoupon, checkoutItems);
      setDiscountAmount(discount);
    }
  }, [appliedCoupon, checkoutItems]);

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
    setShippingCharge(subtotalAmount < 1000 ? 30 : 0);
  }, [subtotalAmount]);

  const handleCheckout = async () => {
    try {
      setError("");

      if (!validateForm()) {
        return;
      }

      // Check auth - Optional now
      await checkAuth();

      // If authenticated, sync profile details in background if missing
      if (user && isAuthenticated) {
        const needsUpdate = !user.user_metadata?.phone || !user.user_metadata?.full_name;
        if (needsUpdate) {
          const client = getSupabaseClient();
          await client.auth.updateUser({ 
            data: { 
              phone: user.user_metadata?.phone || shippingAddress.phone,
              full_name: user.user_metadata?.full_name || shippingAddress.name
            } 
          });
          await checkAuth(); // Refresh local store
        }
      }

      setIsProcessing(true);
      setPaymentStep('processing');

      // Create order object for Razorpay
      const order = {
        items: checkoutItems.map(item => ({
          product_id: item.product_id || item.id, // Handle both cart items and direct items
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? "",
          image: item.image,
        })),
        total: subtotalAmount + shippingCharge - discountAmount,
        discount: discountAmount,
        coupon_code: appliedCoupon?.code,
        shipping_address: shippingAddress,
        payment_method: 'razorpay' as 'razorpay' | 'cod',
      };

      const razorpayOrder = await createRazorpayOrder(order);
      setPaymentStep('payment');

      await initializeRazorpayCheckout(
        razorpayOrder,
        shippingAddress,
        // Success callback
        async (verificationData: PaymentVerificationResult) => {
          console.log('Payment verification succeeded:', verificationData.orderId);
          
          // RESET UI IMMEDIATELY to prevent "stuck" state
          setIsProcessing(false);
          setPaymentStep('form');
          setSuccessOrderId(verificationData.orderId);
          setShowSuccessModal(true);
          clearCart();

          // Execute background tasks WITHOUT awaiting them to prevent UI blocking
          (async () => {
            try {
              // Save address if user is logged in and preference is checked
              if (user?.id && saveAddressForFuture) {
                const client = getSupabaseClient()
                await client
                  .from('user_addresses')
                  .upsert({
                    user_id: user.id,
                    type: 'shipping',
                    ...shippingAddress,
                    is_default: true,
                  });
              }

              toast({
                title: "Order Placed Successfully!",
                description: "Thank you for your purchase.",
              });

              // Send Email Notification (Online)
              await notificationService.sendOrderNotification({
                orderId: verificationData.orderId,
                customerName: shippingAddress.name,
                customerEmail: shippingAddress.email,
                customerPhone: shippingAddress.phone,
                items: checkoutItems.map(item => `${item.name} (${item.size}ml) x ${item.quantity}`).join(', '),
                totalAmount: subtotalAmount + shippingCharge,
                paymentMethod: 'Razorpay',
                shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
              });
              
              // Track Purchase
              await analytics.trackEvent('purchase', {
                transaction_id: verificationData.orderId,
                value: subtotalAmount + shippingCharge,
                items: checkoutItems.map(i => i.name)
              });
            } catch (bgError) {
              console.warn('Background checkout task failed (non-blocking):', bgError);
            }
          })();
        },
        // Error/Cancel callback
        (error) => {
          console.log('Razorpay callback received error/cancel:', error.message);
          const isCancelled = error.message.includes('cancelled');
          
          toast({
            title: isCancelled ? "Payment Cancelled" : "Payment Failed",
            description: isCancelled ? "The payment process was cancelled." : (error.message || "Something went wrong. Please try again."),
            variant: isCancelled ? "default" : "destructive",
          });

          setError(error.message || "Payment failed. Please try again.");
          setIsProcessing(false);
          setPaymentStep('form');
        },
        // onProcessing callback
        () => {
          setPaymentStep('processing');
        }
      );
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : "An error occurred during checkout");
      setIsProcessing(false);
      setPaymentStep('form');
    }
  };

  const handleWhatsAppOrder = async () => {
    // 1. Trigger the standard form validation to show red borders/errors in UI
    const isFormValid = validateForm();

    // 2. Collect missing fields for a specific toast message
    const missing = [];
    if (!shippingAddress.name?.trim()) missing.push("Name");
    if (!shippingAddress.phone?.trim()) missing.push("Phone Number");
    if (!shippingAddress.address?.trim()) missing.push("Delivery Address");
    if (!shippingAddress.city?.trim()) missing.push("City");
    if (!shippingAddress.pincode?.trim()) missing.push("PIN Code");

    if (!isFormValid || missing.length > 0) {
      toast({
        title: "Details Required",
        description: `Please fill in your ${missing.slice(0, 2).join(", ")}${missing.length > 2 ? ' etc.' : ''} to confirm your COD order on WhatsApp.`,
        variant: "destructive",
      });
      
      // Scroll to the first error or the form top
      const formElement = document.getElementById('name');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        window.scrollTo({ top: 400, behavior: 'smooth' });
      }
      return;
    }

    try {
      // If authenticated, sync profile details in background if missing
      if (user && isAuthenticated) {
        const needsUpdate = !user.user_metadata?.phone || !user.user_metadata?.full_name;
        if (needsUpdate) {
          const client = getSupabaseClient();
          await client.auth.updateUser({ 
            data: { 
              phone: user.user_metadata?.phone || shippingAddress.phone,
              full_name: user.user_metadata?.full_name || shippingAddress.name
            } 
          });
          await checkAuth(); // Refresh local store
        }
      }

      setIsProcessing(true);
      setPaymentStep('processing');

      const itemsText = checkoutItems
        .map((item) => `• *${item.name}* (${item.size}ml) x ${item.quantity} - ₹${item.price * item.quantity}`)
        .join("\n");

      const total = subtotalAmount + shippingCharge - discountAmount;
      
      // 1. Save order to Supabase first to get the actual ID
      const orderData = {
        user_id: user?.id || null,
        items: checkoutItems.map(item => ({
          product_id: item.product_id || item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          size: item.size ?? "",
          image: item.image,
        })),
        total_amount: total, // Using total_amount to match schema in order-success
        discount_amount: discountAmount,
        coupon_code: appliedCoupon?.code,
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: 'cod',
        status: 'pending',
        created_at: new Date().toISOString()
      };

      // Save address if user is logged in and preference is checked
      if (user?.id && saveAddressForFuture) {
        const client = getSupabaseClient()
        await client
          .from('user_addresses')
          .upsert({
            user_id: user.id,
            type: 'shipping',
            ...shippingAddress,
            is_default: true,
          });
      }

      const client = getSupabaseClient()
      const { data: savedOrder, error: dbError } = await client
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (dbError) {
        console.error('Error saving COD order:', dbError);
        throw new Error("Failed to record order. Please try again.");
      }

      const orderId = savedOrder.id;
      const displayId = typeof orderId === 'string' && orderId.includes('-') ? orderId.slice(-8).toUpperCase() : orderId;

      const messageText = 
        `🛍️ *NEW COD ORDER CONFIRMATION*\n\n` +
        `🆔 *Order ID:* #${displayId}\n` +
        `👤 *Customer Details:*\n` +
        `Name: ${shippingAddress.name}\n` +
        `Phone: ${shippingAddress.phone}\n\n` +
        `📦 *Order Details:*\n` +
        `${itemsText}\n\n` +
        (appliedCoupon ? `🎟️ *Coupon:* ${appliedCoupon.code} (-₹${discountAmount})\n` : '') +
        `💰 *Total Amount:* ₹${total}\n\n` +
        `📍 *Delivery Address:*\n` +
        `${shippingAddress.address}\n` +
        `${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}\n\n` +
        `Please confirm my COD order. Thank you!`;

      // 2. Send Email Notification
      notificationService.sendOrderNotification({
        orderId: orderId,
        customerName: shippingAddress.name,
        customerEmail: shippingAddress.email,
        customerPhone: shippingAddress.phone,
        items: checkoutItems.map(item => `${item.name} (${item.size}ml) x ${item.quantity}`).join(', '),
        totalAmount: total,
        paymentMethod: 'WhatsApp (COD)',
        shippingAddress: `${shippingAddress.address}, ${shippingAddress.city}, ${shippingAddress.state} - ${shippingAddress.pincode}`
      });

      // 3. Track Potential Purchase
      analytics.trackEvent('contact_click', {
        type: 'whatsapp_cod',
        value: total
      });

      const whatsappUrl = `https://wa.me/919328701508?text=${encodeURIComponent(messageText)}`;
      
      setIsProcessing(false);
      setPaymentStep('form');
      clearCart();

      // Open WhatsApp
      const newWindow = window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      if (!newWindow) {
        window.location.href = whatsappUrl;
      }

      toast({
        title: "Order Request Sent",
        description: "Your order has been recorded and details sent via WhatsApp.",
      });

      router.push(`/order-success?orderId=${orderId}&method=cod`);
    } catch (err) {
      console.error('Error in COD flow:', err);
      setIsProcessing(false);
      setPaymentStep('form');
      toast({
        title: "Order Failed",
        description: err instanceof Error ? err.message : "Could not process your COD order. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Show null only if truly nothing to checkout AND we are still loading/redirecting
  if (!isLoading && checkoutItems.length === 0 && cartItems.length === 0 && !productIdParam) {
    return null;
  }


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

          {paymentStep === 'processing' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-md"
            >
              <div className="text-center p-8 max-w-sm">
                <div className="relative h-20 w-20 mx-auto mb-6">
                  <div className="absolute inset-0 border-4 border-white/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
                <h2 className="text-xl font-serif text-white mb-2">Processing your payment...</h2>
                <p className="text-white/60 text-xs uppercase tracking-widest leading-relaxed">
                  Verifying transaction with your bank. Please do not refresh or close this page.
                </p>
                
                {processingTime > 15 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-8 space-y-4"
                  >
                    <p className="text-xs text-amber-400/80 italic">
                      This is taking longer than usual. Please check your order history if payment was deducted.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsProcessing(false);
                          setPaymentStep('form');
                        }}
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        Cancel & Return to Checkout
                      </Button>
                      <Button 
                        onClick={() => router.push('/profile?tab=orders')}
                        className="bg-white text-black"
                      >
                        Check Order Status
                      </Button>
                    </div>
                  </motion.div>
                )}

                <div className="mt-8 pt-8 border-t border-white/5">
                   <p className="text-[10px] text-white/30 uppercase tracking-[0.2em]">Secured by Vave Payments</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Success Modal */}
          {showSuccessModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center backdrop-blur-sm"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-zinc-900 border border-white/10 p-8 rounded-2xl max-w-md w-full text-center shadow-2xl relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Payment Approved!</h2>
                <p className="text-zinc-400 mb-8">
                  Your order has been placed successfully. A confirmation email has been sent.
                </p>
                <div className="space-y-3">
                  <Button
                    onClick={() => {
                      if (isAuthenticated) {
                        router.push('/profile?tab=orders');
                      } else {
                        router.push(`/order-success?orderId=${successOrderId}`);
                      }
                    }}
                    className="w-full bg-white text-black hover:bg-zinc-200 h-12 rounded-xl font-semibold"
                  >
                    View Order Details
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}

          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Information */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 space-y-6">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Truck className="h-5 w-5" />
                    Delivery Details
                  </h2>

                  {/* Saved Addresses for Authenticated Users */}
                  {isAuthenticated && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-xs uppercase tracking-wider text-gray-400">Select Saved Address</Label>
                      <div className="grid grid-cols-1 gap-2">
                        {savedAddresses.map((addr) => (
                          <div
                            key={addr.id}
                            onClick={() => handleAddressSelect(addr.id)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedAddressId === addr.id
                                ? 'bg-white/10 border-white shadow-[0_0_15px_rgba(255,255,255,0.1)]'
                                : 'bg-white/5 border-white/5 hover:border-white/20'
                              }`}
                          >
                            <div className="flex justify-between items-center text-sm">
                              <div>
                                <p className="font-medium text-white">{addr.address}</p>
                                <p className="text-xs opacity-60">{addr.city}, {addr.state} - {addr.pincode}</p>
                              </div>
                              {selectedAddressId === addr.id && (
                                <CheckCircle2 className="h-4 w-4 text-white" />
                              )}
                            </div>
                          </div>
                        ))}
                        <div
                          onClick={() => handleAddressSelect('new')}
                          className={`p-2 rounded-xl border border-dashed cursor-pointer text-center text-xs transition-all ${selectedAddressId === 'new'
                              ? 'bg-white/10 border-white text-white'
                              : 'bg-white/5 border-white/10 text-white/40 hover:border-white/30'
                            }`}
                        >
                          + Use different address
                        </div>
                      </div>
                    </div>
                  )}

                    {(!isAuthenticated || savedAddresses.length === 0 || selectedAddressId === 'new') && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-6 pt-4 border-t border-white/5"
                      >
                        <div className="space-y-4">
                          <h3 className="text-sm font-medium text-white/60">Basic Contact Details</h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                              label="Full Name"
                              name="name"
                              placeholder="First and last name"
                              value={shippingAddress.name}
                              onChange={handleInputChange}
                              error={fieldErrors.name}
                            />
                            <FormField
                              label="Phone Number"
                              name="phone"
                              placeholder="10-digit mobile number"
                              value={shippingAddress.phone}
                              onChange={handleInputChange}
                              error={fieldErrors.phone}
                            />
                          </div>
                          <FormField
                            label="Email Address"
                            name="email"
                            type="email"
                            placeholder="your@email.com"
                            value={shippingAddress.email}
                            onChange={handleInputChange}
                            error={fieldErrors.email}
                          />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-white/5">
                          <h3 className="text-sm font-medium text-white/60">Delivery Address</h3>
                          <FormField
                            label="Street Address"
                            name="address"
                            placeholder="Flat/House No, Street, Landmark"
                            value={shippingAddress.address}
                            onChange={handleInputChange}
                            error={fieldErrors.address}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              label="City"
                              name="city"
                              placeholder="City"
                              value={shippingAddress.city}
                              onChange={handleInputChange}
                              error={fieldErrors.city}
                            />
                            <FormField
                              label="State"
                              name="state"
                              placeholder="State"
                              value={shippingAddress.state}
                              onChange={handleInputChange}
                              error={fieldErrors.state}
                            />
                          </div>

                          <FormField
                            label="PIN Code"
                            name="pincode"
                            placeholder="6-digit PIN code"
                            value={shippingAddress.pincode}
                            onChange={handleInputChange}
                            error={fieldErrors.pincode}
                          />

                          {isAuthenticated && (
                            <div className="flex items-center space-x-2 pt-2">
                              <input
                                type="checkbox"
                                id="saveAddress"
                                checked={saveAddressForFuture}
                                onChange={(e) => setSaveAddressForFuture(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-white"
                              />
                              <Label htmlFor="saveAddress" className="text-sm text-white/70 cursor-pointer">
                                Save this address for future purchases
                              </Label>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                </div>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6 sticky top-4">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                  <div className="space-y-4">
                    {checkoutItems.map((item) => (
                      <div key={`${item.product_id || item.id}-${item.size}`} className="flex items-center gap-4">
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
                        <span>₹{subtotalAmount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{shippingCharge === 0 ? 'Free' : `₹${shippingCharge}`}</span>
                      </div>
                      {discountAmount > 0 && (
                        <div className="flex justify-between text-sm text-green-400">
                          <span>Discount ({appliedCoupon?.code})</span>
                          <span>-₹{discountAmount}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-medium text-lg pt-2 border-t border-white/10">
                        <span>Total</span>
                        <span>₹{subtotalAmount + shippingCharge - discountAmount}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <BadgePercent className="h-3 w-3" />
                        <span>GST is included in the displayed prices</span>
                      </div>
                    </div>

                    {/* Coupon Section */}
                    <div className="pt-4 border-t border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <Label className="text-xs uppercase tracking-widest text-white/40">Coupon Code</Label>
                        {appliedCoupon && (
                          <button 
                            onClick={handleRemoveCoupon}
                            className="text-[10px] text-red-400 hover:text-red-300 uppercase tracking-tighter"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                      
                      {!appliedCoupon ? (
                        <div className="flex gap-2">
                          <Input
                            placeholder="VAVE10, FIRSTORDER"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            className="bg-white/5 border-white/10 h-10 rounded-none text-xs tracking-widest"
                          />
                          <Button 
                            onClick={handleApplyCoupon}
                            disabled={isValidatingCoupon || !couponCode.trim()}
                            className="bg-white text-black hover:bg-zinc-200 px-4 h-10 rounded-none text-[10px] uppercase tracking-widest font-bold"
                          >
                            {isValidatingCoupon ? "..." : "Apply"}
                          </Button>
                        </div>
                      ) : (
                        <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-none flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <BadgePercent className="h-4 w-4 text-green-400" />
                            <span className="text-xs font-bold text-green-400 tracking-widest">{appliedCoupon.code}</span>
                          </div>
                          <span className="text-[10px] text-green-400/60 uppercase">{appliedCoupon.description}</span>
                        </div>
                      )}
                      
                      {couponError && (
                        <p className="text-[10px] text-red-400 uppercase tracking-widest">{couponError}</p>
                      )}
                    </div>
                  </div>

                  {/* Payment Options Section */}
                  <div className="mt-8 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Payment Options</h3>
                      <div className="space-y-4">
                        {/* Online Payment Option */}
                        <div className="p-4 rounded-xl border border-white/20 bg-white/5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">Online Payment</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/20">Recommended</span>
                          </div>
                          <p className="text-xs text-gray-400 mb-4">
                            Pay securely via Cards, UPI, NetBanking or Wallets. (Online payment is processed through Razorpay)
                          </p>
                          <Button
                            className="w-full h-11 bg-white text-black hover:bg-gray-200 font-semibold"
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
                                Pay ₹{subtotalAmount + shippingCharge - discountAmount} Online
                              </span>
                            )}
                          </Button>
                        </div>

                        {/* WhatsApp COD Option */}
                        <div className="p-4 rounded-xl border border-white/10 bg-white/5 relative overflow-hidden group">
                          <div className="absolute top-0 right-0 p-2">
                            <MessageCircle className="h-4 w-4 text-green-500/30" />
                          </div>
                          <span className="font-medium block mb-1">Cash on Delivery (COD)</span>
                          <p className="text-xs text-gray-400 mb-4">
                            Prefer COD? Place your order directly on WhatsApp with our team.
                          </p>
                          <Button
                            variant="outline"
                            className="w-full h-11 border-green-500/30 hover:border-green-500 bg-green-500/10 hover:bg-green-500 text-white hover:text-white transition-all duration-300"
                            onClick={handleWhatsAppOrder}
                          >
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Order via WhatsApp (COD)
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>


                  {shippingCharge > 0 && (
                    <p className="text-xs text-center text-gray-400 mt-2">
                      Add ₹{1000 - subtotalAmount} more for free shipping
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

export default function Checkout() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
