"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2, Phone, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/src/lib/auth"

function LoginForm() {
  const { user, login, loginWithGoogle, isAuthenticated, signInWithPhone, verifyPhoneOtp } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email")
  const [loginStep, setLoginStep] = useState<"form" | "otp">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailForm, setEmailForm] = useState({ email: "", password: "" })
  const [phoneForm, setPhoneForm] = useState({ phone: "", otp: "" })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; phone?: string; otp?: string }>({})
  const [loginError, setLoginError] = useState("")
  const [resendTimer, setResendTimer] = useState(0)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/profile'

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && user) {
      const checkAdminAndRedirect = async () => {
        const isAdmin = await adminService.isAdmin(user)
        if (redirectTo === '/profile' && isAdmin) {
          router.replace('/admin')
        } else {
          router.replace(redirectTo)
        }
      }
      checkAdminAndRedirect()
    }
  }, [isAuthenticated, user, redirectTo, router])

  // Show error from OAuth redirect if present
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      const details = searchParams.get('details')
      setLoginError(details || `Authentication error: ${error}`)
    }
  }, [searchParams])

  // Resend Timer Logic
  useEffect(() => {
    let timer: any
    if (resendTimer > 0) {
      timer = setInterval(() => setResendTimer(t => t - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [resendTimer])

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    try {
      const result = await signInWithPhone(phoneForm.phone)
      if (result.success) {
        setResendTimer(60)
        toast({ title: "OTP Resent", description: "Verification code sent to your phone." })
      } else {
        setLoginError(result.error || "Failed to resend OTP")
      }
    } catch (error: any) {
      setLoginError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const validateEmailForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}
    if (!emailForm.email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      errors.email = "Please enter a valid email address"
    }
    if (!emailForm.password) {
      errors.password = "Password is required"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validatePhoneForm = (): boolean => {
    const errors: { phone?: string; otp?: string } = {}
    if (!phoneForm.phone.trim()) {
      errors.phone = "Phone number is required"
    } else if (!/^\d{10,15}$/.test(phoneForm.phone.replace(/[^0-9]/g, ""))) {
      errors.phone = "Please enter a valid phone number"
    }
    if (loginStep === "otp" && (!phoneForm.otp || phoneForm.otp.length < 6)) {
      errors.otp = "Please enter the 6-digit code"
    }
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (!validateEmailForm()) return
    setIsLoading(true)
    try {
      const result = await login(emailForm.email, emailForm.password)
      if (!result.success) {
        setLoginError(result.error || "Login failed")
        return
      }
      toast({ title: "Welcome back!", description: "Signed in successfully." })
      
      // If no specific redirect and user is admin, go to admin dashboard
      const isAdmin = result.user ? await adminService.isAdmin(result.user) : false
      if (redirectTo === '/profile' && isAdmin) {
        router.replace('/admin')
      } else {
        router.replace(redirectTo)
      }
    } catch (error: any) {
      setLoginError(error.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")
    if (!validatePhoneForm()) return
    setIsLoading(true)
    try {
      if (loginStep === "form") {
        const result = await signInWithPhone(phoneForm.phone)
        if (result.success) {
          setLoginStep("otp")
          toast({ title: "OTP Sent", description: "Please check your phone for the verification code." })
        } else {
          setLoginError(result.error || "Failed to send OTP")
        }
      } else {
        const result = await verifyPhoneOtp(phoneForm.phone, phoneForm.otp)
        if (result.success) {
          toast({ title: "Success", description: "Identity verified successfully." })
          
          // If no specific redirect and user is admin, go to admin dashboard
          const isAdmin = result.user ? await adminService.isAdmin(result.user) : false
          if (redirectTo === '/profile' && isAdmin) {
            router.replace('/admin')
          } else {
            router.replace(redirectTo)
          }
        } else {
          setLoginError(result.error || "Invalid OTP")
        }
      }
    } catch (error: any) {
      setLoginError(error.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)
      setLoginError("")
      await loginWithGoogle(redirectTo)
    } catch (error: any) {
      setLoginError(error.message || "Failed to login with Google")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-sans selection:bg-white selection:text-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[450px] bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-none shadow-2xl relative z-10 overflow-hidden"
      >
        {/* Progress bar at top for loading */}
        <AnimatePresence>
          {isLoading && (
            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-0 left-0 h-[1px] w-full bg-white z-50"
            />
          )}
        </AnimatePresence>

        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-serif text-white mb-3 tracking-tight">Welcome Back</h1>
            <p className="text-[12px] uppercase tracking-[0.3em] text-white/50 font-medium">Access your account effortlessly</p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex mb-10 bg-zinc-950 p-1 border border-white/5">
             <button 
              onClick={() => { setActiveTab("email"); setLoginStep("form"); setLoginError(""); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === "email" ? 'bg-zinc-800 text-white font-bold' : 'text-white/30 hover:text-white/60'}`}
             >
                Email
             </button>
             <button 
              onClick={() => { setActiveTab("phone"); setLoginStep("form"); setLoginError(""); }}
              className={`flex-1 py-3 text-[10px] uppercase tracking-widest transition-all duration-500 ${activeTab === "phone" ? 'bg-zinc-800 text-white font-bold' : 'text-white/30 hover:text-white/60'}`}
             >
                Phone
             </button>
          </div>

          {/* Global Error message */}
          <AnimatePresence mode="wait">
            {loginError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3"
              >
                <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
                <p className="text-[11px] text-red-400 uppercase tracking-widest leading-relaxed">{loginError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            {activeTab === "email" ? (
              <motion.form 
                key="email-form"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                onSubmit={handleEmailLogin} 
                className="space-y-8"
              >
                <div className="space-y-3">
                  <label className="text-[11px] uppercase tracking-[0.15em] text-white/80 font-semibold flex items-center gap-2">
                    <Mail size={12} className="opacity-70" />
                    Email Address
                  </label>
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all placeholder:text-zinc-500 text-sm ${fieldErrors.email ? 'border-red-500' : ''}`}
                    value={emailForm.email}
                    onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                  {fieldErrors.email && (
                    <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">{fieldErrors.email}</p>
                  )}
                  {emailForm.email.trim().toLowerCase() === 'admin@vavefragrances.dev' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pt-2">
                      <Button 
                        type="button" 
                        onClick={() => setEmailForm(f => ({ ...f, password: 'VaveAdmin#2026' }))}
                        className="w-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 h-10 rounded-none text-[9px] uppercase tracking-[0.2em] hover:bg-emerald-500/20"
                      >
                        Autofill Admin Password
                      </Button>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-end">
                    <label className="text-[12px] uppercase tracking-[0.2em] text-white/80 font-semibold flex items-center gap-2">
                      <Lock size={12} className="opacity-70" />
                      Password
                    </label>
                    <Link href="/auth/forgot-password" size="sm" className="text-[11px] uppercase tracking-[0.1em] text-white/40 hover:text-white transition-colors">
                      Forgot?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all placeholder:text-zinc-500 text-sm ${fieldErrors.password ? 'border-red-500' : ''}`}
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      autoComplete="current-password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">{fieldErrors.password}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-white hover:bg-zinc-200 text-black h-16 rounded-none text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50" 
                  disabled={isLoading}
                >
                  {isLoading ? "Authenticating..." : "Sign In"}
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="phone-form"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                onSubmit={handlePhoneLogin} 
                className="space-y-8"
              >
                {loginStep === "form" ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      <label className="text-[12px] uppercase tracking-[0.1em] text-white/80 font-bold flex items-center gap-2">
                        <Phone size={12} className="opacity-70" />
                        Phone Number
                      </label>
                      <Input
                        type="tel"
                        placeholder="+91 98765 43210"
                        className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all placeholder:text-zinc-500 text-sm ${fieldErrors.phone ? 'border-red-500' : ''}`}
                        value={phoneForm.phone}
                        onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                        autoComplete="tel"
                        disabled={isLoading}
                      />
                      <p className="text-[9px] text-white/20 uppercase tracking-[0.2em] font-medium italic">We will send a 6-digit OTP to your phone</p>
                      {fieldErrors.phone && (
                        <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">{fieldErrors.phone}</p>
                      )}
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-white hover:bg-zinc-200 text-black h-16 rounded-none text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending Code..." : "Send OTP"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="space-y-3">
                       <div className="flex justify-between items-end">
                        <label className="text-[12px] uppercase tracking-[0.1em] text-white/80 font-bold flex items-center gap-2">
                          <Hash size={12} className="opacity-70" />
                          Enter 6-digit OTP
                        </label>
                        <button 
                          onClick={() => setLoginStep("form")}
                          className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors"
                        >
                          Change Number
                        </button>
                      </div>
                      <Input
                        type="text"
                        placeholder="000000"
                        maxLength={6}
                        className={`bg-zinc-950 border-white/10 text-white rounded-none h-14 focus:border-white/40 focus:ring-0 transition-all text-center text-xl tracking-[1em] ${fieldErrors.otp ? 'border-red-500' : ''}`}
                        value={phoneForm.otp}
                        onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                        disabled={isLoading}
                      />
                      {fieldErrors.otp && (
                        <p className="text-[10px] text-red-500 font-medium uppercase tracking-widest">{fieldErrors.otp}</p>
                      )}
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading || resendTimer > 0}
                          className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors disabled:opacity-30"
                        >
                          {resendTimer > 0 ? `Resend code in ${resendTimer}s` : "Didn't receive code? Resend"}
                        </button>
                      </div>
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full bg-white hover:bg-zinc-200 text-black h-16 rounded-none text-[11px] uppercase tracking-[0.4em] font-bold shadow-xl transition-all duration-500 disabled:opacity-50" 
                      disabled={isLoading}
                    >
                      {isLoading ? "Verifying..." : "Verify & Sign In"}
                    </Button>
                  </div>
                )}
              </motion.form>
            )}
          </AnimatePresence>

          {/* Social Social integration */}
          <div className="mt-12 text-center space-y-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-[0.5em] text-white/15">
                <span className="bg-zinc-900 border border-white/5 px-6 py-1">Other login options</span>
              </div>
            </div>

              <Button 
              variant="outline" 
              className="w-full bg-transparent border-white/10 hover:border-white/40 hover:bg-white/5 text-white h-14 rounded-none text-[10px] uppercase tracking-[0.3em] transition-all duration-500 font-medium" 
              onClick={() => handleGoogleLogin()} 
              disabled={isLoading}
            >
              <Image src="/google-logo.svg" alt="Google" width={18} height={18} className="mr-4 opacity-70 group-hover:opacity-100" />
              Sign in with Google
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="py-8 bg-white/5 border-t border-white/10 text-center">
          <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-white hover:text-zinc-400 transition-colors font-bold ml-2 underline underline-offset-4 decoration-white/20">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4">
        <div className="w-10 h-[1px] bg-white/20 relative overflow-hidden">
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
