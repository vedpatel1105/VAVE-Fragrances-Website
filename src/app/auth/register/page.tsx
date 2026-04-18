// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/src/lib/auth";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterPage() {
  const { loginWithGoogle, register } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [registerError, setRegisterError] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
    // Clear field error on change
    if (fieldErrors[name as keyof FieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (registerError) setRegisterError("");
  };

  const getPasswordStrength = (password: string): { level: string; color: string; percent: number } => {
    if (!password) return { level: "", color: "", percent: 0 };
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 1) return { level: "Weak", color: "bg-red-500", percent: 20 };
    if (score <= 2) return { level: "Fair", color: "bg-orange-500", percent: 40 };
    if (score <= 3) return { level: "Good", color: "bg-yellow-500", percent: 60 };
    if (score <= 4) return { level: "Strong", color: "bg-green-500", percent: 80 };
    return { level: "Very Strong", color: "bg-green-600", percent: 100 };
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};

    if (!formData.name.trim()) {
      errors.name = "Full name is required";
    } else if (formData.name.trim().length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      errors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }

    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getUserFriendlyError = (msg: string): string => {
    if (msg.includes("already registered") || msg.includes("already been registered")) {
      return "An account with this email already exists. Please sign in instead.";
    }
    if (msg.includes("Password should be")) {
      return "Password is too weak. Use at least 6 characters with a mix of letters and numbers.";
    }
    if (msg.includes("rate limit") || msg.includes("Too many")) {
      return "Too many attempts. Please wait a moment and try again.";
    }
    return msg || "Registration failed. Please try again.";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");

    if (!formData.agreeTerms) {
      toast({
        title: "Terms & Conditions",
        description: "Please agree to the terms and conditions to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const result = await register(
        formData.email,
        formData.password,
        formData.name,
        formData.phone
      );

      if (!result.success) {
        setRegisterError(getUserFriendlyError(result.error || ""));
        return;
      }

      toast({
        title: "Account Created!",
        description: "We've sent a confirmation link to your email. Please check your inbox.",
      });

      router.push("/auth/check-your-email");
    } catch (error: any) {
      setRegisterError(getUserFriendlyError(error.message || ""));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setIsLoading(true);
    setRegisterError("");
    try {
      await loginWithGoogle("/profile");
    } catch (error: any) {
      setRegisterError(getUserFriendlyError(error.message || ""));
      setIsLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_0%,transparent_100%)] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-none shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Join Vave</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Step into the world of fine scent</p>
          </div>

          {/* Global error */}
          {registerError && (
             <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-none bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-400 uppercase tracking-wider leading-relaxed">{registerError}</p>
            </motion.div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Full Name</label>
              <Input
                type="text"
                name="name"
                placeholder="ELARA VANCE"
                className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/5 uppercase ${fieldErrors.name ? 'border-red-500/50' : ''}`}
                value={formData.name}
                onChange={handleChange}
                autoComplete="name"
              />
              {fieldErrors.name && <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.name}</p>}
            </div>

            {/* Email & Phone Grid */}
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="name@example.com"
                   className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10 ${fieldErrors.email ? 'border-red-500/50' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
                {fieldErrors.email && <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.email}</p>}
              </div>

              <div className="space-y-2">
                 <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Phone</label>
                <Input
                  type="tel"
                  name="phone"
                  placeholder="+91 00000 00000"
                   className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10 ${fieldErrors.phone ? 'border-red-500/50' : ''}`}
                  value={formData.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                />
                {fieldErrors.phone && <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.phone}</p>}
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
               <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Security Key</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10 pr-12 ${fieldErrors.password ? 'border-red-500/50' : ''}`}
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              {/* Luxury strength indicator */}
              {formData.password && (
                <div className="flex gap-1 px-1 mt-2">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div 
                      key={level}
                      className={`h-[2px] flex-1 transition-all duration-500 ${
                        (passwordStrength.percent / 20) >= level 
                          ? 'bg-white' 
                          : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
              )}
              {fieldErrors.password && <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.password}</p>}
            </div>

            {/* Terms */}
            <div className="flex items-center space-x-3 px-1 py-2">
              <Checkbox
                id="terms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onCheckedChange={(checked) =>
                  setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                }
                className="rounded-none border-white/20 data-[state=checked]:bg-white data-[state=checked]:text-black"
              />
              <label
                htmlFor="terms"
                className="text-[9px] uppercase tracking-widest text-white/40 leading-relaxed cursor-pointer"
              >
                I agree to the{" "}
                <Link href="/terms" className="text-white hover:underline">Terms</Link> & <Link href="/privacy" className="text-white hover:underline">Privacy</Link>
              </label>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-500" 
              disabled={isLoading}
            >
              {isLoading ? (
                 <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Forging Profile...
                </span>
              ) : (
                <span className="flex items-center">
                  Create Account
                  <ArrowRight className="ml-2 h-3 w-3" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                 <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[8px] uppercase tracking-[0.4em] text-white/20">
                <span className="bg-zinc-900 px-4">Social Integration</span>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-white/10 hover:border-white/30 hover:bg-white/5 text-white h-12 rounded-none text-[10px] uppercase tracking-[0.2em] transition-all"
              onClick={handleGoogleRegister}
              disabled={isLoading}
            >
              <Image
                src="/google-logo.svg"
                alt="Google"
                width={18}
                height={18}
                className="mr-3 opacity-80"
              />
              Register with Google
            </Button>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            Already a member?{" "}
            <Link href="/auth/login" className="text-white hover:text-white/70 transition-colors font-bold ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
