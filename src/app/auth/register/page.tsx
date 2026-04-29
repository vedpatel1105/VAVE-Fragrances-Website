// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/src/lib/auth";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export default function RegisterPage() {
  const { loginWithGoogle, register, signInWithPhone, verifyPhoneOtp, updateUserMetadata } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email");
  const [registerStep, setRegisterStep] = useState<"form" | "otp" | "details">("form");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    otp: "",
    agreeTerms: true,
  });
  
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [registerError, setRegisterError] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (registerError) setRegisterError("");
  };

  // Resend Timer Logic
  useEffect(() => {
    let timer: any;
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (resendTimer > 0) return;
    setIsLoading(true);
    try {
      const result = await signInWithPhone(formData.phone);
      if (result.success) {
        setResendTimer(60);
        toast({ title: "OTP Resent", description: "A new code has been dispatched." });
      } else {
        setRegisterError(result.error || "Failed to resend OTP");
      }
    } catch (error: any) {
      setRegisterError(error.message || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const validateEmailFlow = (): boolean => {
    const errors: FieldErrors = {};
    if (!formData.name.trim()) errors.name = "Full name is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Invalid email format";
    if (!formData.password) errors.password = "Security key is required";
    else if (formData.password.length < 6) errors.password = "Minimum 6 characters";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePhoneFlow = (): boolean => {
    const errors: FieldErrors = {};
    if (!formData.phone.trim()) errors.phone = "Phone number is required";
    if (registerStep === "otp" && !formData.otp) errors.otp = "Verification code required";
    if (registerStep === "details" && !formData.name.trim()) errors.name = "Full name is required";
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailFlow()) return;
    setIsLoading(true);
    try {
      const result = await register(formData.email, formData.password, formData.name, formData.phone);
      if (result.success) {
        toast({ title: "Account Created", description: "Please check your email for confirmation." });
        router.push("/auth/check-your-email");
      } else {
        setRegisterError(result.error || "Registration failed");
      }
    } catch (error: any) {
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePhoneFlow()) return;
    setIsLoading(true);
    setRegisterError("");

    try {
      if (registerStep === "form") {
        const result = await signInWithPhone(formData.phone);
        if (result.success) {
          setRegisterStep("otp");
          toast({ title: "Verification Code Sent", description: "SMS successfully dispatched." });
        } else {
          setRegisterError(result.error || "Failed to initiate SMS");
        }
      } else if (registerStep === "otp") {
        const result = await verifyPhoneOtp(formData.phone, formData.otp);
        if (result.success) {
          // If first time, we need name
          if (!result.user?.full_name) {
             setRegisterStep("details");
          } else {
             window.location.replace("/profile");
          }
        } else {
          setRegisterError("Invalid verification code");
        }
      } else if (registerStep === "details") {
        const result = await updateUserMetadata({ full_name: formData.name });
        if (result.success) {
           window.location.replace("/profile");
        } else {
           setRegisterError(result.error || "Failed to save profile details");
        }
      }
    } catch (error: any) {
      setRegisterError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-white selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 rounded-none shadow-2xl relative z-10"
      >
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-tight">Join Vave</h1>
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/50 font-medium">Create your premium account easily</p>
          </div>

          {/* Mode Switcher */}
          <div className="flex mb-10 bg-zinc-950 p-1 border border-white/5">
            <button 
              onClick={() => { setActiveTab("email"); setRegisterStep("form"); setRegisterError(""); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === "email" ? 'bg-zinc-800 text-white font-bold' : 'text-white/30 hover:text-white/60'}`}
            >
              Email Access
            </button>
            <button 
              onClick={() => { setActiveTab("phone"); setRegisterStep("form"); setRegisterError(""); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === "phone" ? 'bg-zinc-800 text-white font-bold' : 'text-white/30 hover:text-white/60'}`}
            >
              Phone Access
            </button>
          </div>

          <AnimatePresence mode="wait">
            {registerError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3"
              >
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                <p className="text-[11px] text-red-400 uppercase tracking-widest">{registerError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "email" ? (
              <motion.form 
                key="email-reg"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleEmailRegister} 
                className="space-y-6"
              >
                <div className="space-y-3">
                  <label className="text-[12px] uppercase tracking-[0.1em] text-white/80 font-bold flex items-center gap-2">
                    <User size={12} className="opacity-70" />
                    Full Name
                  </label>
                  <Input
                    name="name"
                    placeholder="ELARA VANCE"
                    className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 transition-all text-sm uppercase tracking-wider placeholder:text-zinc-500 ${fieldErrors.name ? 'border-red-500' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {fieldErrors.name && <p className="text-[10px] text-red-500 uppercase tracking-widest">{fieldErrors.name}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] uppercase tracking-[0.1em] text-white/80 font-bold flex items-center gap-2">
                    <Mail size={12} className="opacity-70" />
                    Email
                  </label>
                  <Input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 transition-all text-sm placeholder:text-zinc-500 ${fieldErrors.email ? 'border-red-500' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {fieldErrors.email && <p className="text-[10px] text-red-500 uppercase tracking-widest">{fieldErrors.email}</p>}
                </div>

                <div className="space-y-3">
                  <label className="text-[12px] uppercase tracking-[0.15em] text-white/80 font-bold flex items-center gap-2">
                    <Lock size={12} className="opacity-70" />
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 pr-12 transition-all text-sm placeholder:text-zinc-500 ${fieldErrors.password ? 'border-red-500' : ''}`}
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white">
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-[10px] text-red-500 uppercase tracking-widest">{fieldErrors.password}</p>}
                </div>

                <Button className="w-full bg-white text-black h-16 rounded-none uppercase tracking-[0.4em] font-bold mt-4" disabled={isLoading}>
                  {isLoading ? "Creating Profile..." : "Sign Up"}
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="phone-reg"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handlePhoneRegister} 
                className="space-y-6"
              >
                {registerStep === "form" && (
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold flex items-center gap-2">
                          <Phone size={12} className="opacity-50" />
                          Phone Number
                        </label>
                        <Input
                          name="phone"
                          placeholder="+91 00000 00000"
                          className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 transition-all text-sm ${fieldErrors.phone ? 'border-red-500' : ''}`}
                          value={formData.phone}
                          onChange={handleChange}
                        />
                         <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] italic">We will send a 6-digit OTP to your phone</p>
                      </div>
                      <Button className="w-full bg-white text-black h-16 rounded-none uppercase tracking-[0.4em] font-bold" disabled={isLoading}>
                        Next Step
                      </Button>
                   </div>
                )}

                {registerStep === "otp" && (
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[12px] uppercase tracking-[0.15em] text-white/80 font-bold flex items-center gap-2">
                          <Hash size={12} className="opacity-70" />
                          Enter OTP Code
                        </label>
                        <Input
                          name="otp"
                          maxLength={6}
                          placeholder="000000"
                          className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 transition-all text-sm text-center tracking-[1em] ${fieldErrors.otp ? 'border-red-500' : ''}`}
                          value={formData.otp}
                          onChange={handleChange}
                        />
                      </div>
                      <Button className="w-full bg-white text-black h-16 rounded-none uppercase tracking-[0.4em] font-bold" disabled={isLoading}>
                        Verify Code
                      </Button>
                      <div className="flex justify-center pt-2">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading || resendTimer > 0}
                          className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors disabled:opacity-30"
                        >
                          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Resend Verification Code"}
                        </button>
                      </div>
                   </div>
                )}

                {registerStep === "details" && (
                   <div className="space-y-6">
                      <div className="space-y-3">
                        <label className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold flex items-center gap-2">
                          <User size={12} className="opacity-50" />
                          Signature Name
                        </label>
                        <Input
                          name="name"
                          placeholder="ELARA VANCE"
                          className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 transition-all text-sm uppercase tracking-wider ${fieldErrors.name ? 'border-red-500' : ''}`}
                          value={formData.name}
                          onChange={handleChange}
                        />
                      </div>
                      <Button className="w-full bg-white text-black h-16 rounded-none uppercase tracking-[0.4em] font-bold" disabled={isLoading}>
                        Complete Profile
                      </Button>
                   </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-12 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.5em] text-white/15">
                <span className="bg-zinc-900 border border-white/5 px-6 py-1">Other sign up options</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full bg-transparent border-white/10 hover:border-white/40 hover:bg-white/5 text-white h-14 rounded-none text-[10px] uppercase tracking-[0.3em] font-medium"
              onClick={() => loginWithGoogle("/profile")} 
              disabled={isLoading}
            >
              <Image src="/google-logo.svg" alt="Google" width={18} height={18} className="mr-4 opacity-70" />
              Sign up with Google
            </Button>
          </div>
        </div>

        <div className="py-8 bg-white/5 border-t border-white/10 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-white hover:text-zinc-400 transition-colors font-bold ml-2 underline underline-offset-4 decoration-white/20">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
