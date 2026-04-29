"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Mail, Phone, User, Lock, Eye, EyeOff, AlertCircle, Hash, Loader2, CheckCircle2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuthStore } from "@/src/lib/auth"

interface FieldErrors {
  name?: string
  email?: string
  phone?: string
  password?: string
  otp?: string
}

interface AuthError {
  message: string
  action?: 'login'
}

function friendlyError(raw: string): AuthError {
  const r = raw?.toLowerCase() || ''
  if (r.includes('user already registered') || r.includes('already registered') || r.includes('already exists'))
    return { message: 'An account with this email already exists.', action: 'login' }
  if (r.includes('password') && r.includes('short'))
    return { message: 'Password must be at least 6 characters long.' }
  if (r.includes('invalid email'))
    return { message: 'Please enter a valid email address.' }
  if (r.includes('too many requests') || r.includes('rate limit'))
    return { message: 'Too many attempts. Please wait a few minutes and try again.' }
  if (r.includes('sms') || r.includes('phone') || r.includes('otp'))
    return { message: 'Could not send OTP. Please check the number or try email registration.' }
  if (r.includes('invalid otp') || r.includes('token has expired'))
    return { message: 'Invalid or expired code. Please request a new OTP.' }
  if (r.includes('network') || r.includes('fetch'))
    return { message: 'Network error. Please check your connection.' }
  return { message: raw || 'Something went wrong. Please try again.' }
}

function RegisterForm() {
  const { loginWithGoogle, register, signInWithPhone, verifyPhoneOtp, updateUserMetadata } = useAuthStore()
  const [activeTab, setActiveTab] = useState<"email" | "phone">("email")
  const [step, setStep] = useState<"form" | "otp" | "details">("form")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "", phone: "+91 ", password: "", otp: "" })
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [authError, setAuthError] = useState<AuthError>()
  const [resendTimer, setResendTimer] = useState(0)
  const [otpSentTo, setOtpSentTo] = useState("")
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const email = searchParams.get("email")
    const name = searchParams.get("name")
    const phone = searchParams.get("phone")
    if (email || name || phone) {
      setFormData(prev => ({ ...prev, email: email || prev.email, name: name || prev.name, phone: phone || prev.phone }))
    }
  }, [searchParams])

  useEffect(() => {
    let timer: any
    if (resendTimer > 0) timer = setInterval(() => setResendTimer(t => t - 1), 1000)
    return () => clearInterval(timer)
  }, [resendTimer])

  const change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldErrors(prev => ({ ...prev, [name]: undefined }))
    setAuthError(undefined)
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    const errors: FieldErrors = {}
    if (!formData.name.trim()) errors.name = "Full name is required"
    if (!formData.email.trim()) errors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errors.email = "Enter a valid email address"
    if (!formData.password) errors.password = "Password is required"
    else if (formData.password.length < 6) errors.password = "Minimum 6 characters"
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setIsLoading(true)
    setAuthError(undefined)
    try {
      const result = await register(formData.email.trim(), formData.password, formData.name.trim(), formData.phone)
      if (result.success) {
        toast({ title: "Account Created!", description: "Check your email to confirm your account." })
        window.location.href = '/auth/check-your-email'
      } else {
        setAuthError(friendlyError(result.error || ''))
      }
    } catch (error: any) {
      setAuthError(friendlyError(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const rawPhone = formData.phone.replace(/^\+91\s?/, '').replace(/\s/g, '')
    if (!rawPhone || !/^[6-9]\d{9}$/.test(rawPhone)) {
      setFieldErrors({ phone: "Enter a valid 10-digit Indian mobile number" })
      return
    }
    setFieldErrors({})
    setIsLoading(true)
    setAuthError(undefined)
    try {
      const result = await signInWithPhone(formData.phone)
      if (result.success) {
        setStep("otp")
        setOtpSentTo(formData.phone)
        setResendTimer(60)
        toast({ title: "OTP Sent", description: `Code sent to ${formData.phone}` })
      } else {
        setAuthError(friendlyError(result.error || ''))
      }
    } catch (error: any) {
      setAuthError(friendlyError(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.otp || formData.otp.length < 6) {
      setFieldErrors({ otp: "Enter the 6-digit code" })
      return
    }
    setIsLoading(true)
    setAuthError(undefined)
    try {
      const result = await verifyPhoneOtp(formData.phone, formData.otp)
      if (result.success) {
        if (!result.user?.full_name) {
          setStep("details")
        } else {
          window.location.href = '/profile'
        }
      } else {
        setAuthError(friendlyError(result.error || ''))
      }
    } catch (error: any) {
      setAuthError(friendlyError(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      setFieldErrors({ name: "Full name is required" })
      return
    }
    setIsLoading(true)
    try {
      const result = await updateUserMetadata({ full_name: formData.name.trim() })
      if (result.success) {
        window.location.href = '/profile'
      } else {
        setAuthError(friendlyError(result.error || ''))
      }
    } catch (error: any) {
      setAuthError(friendlyError(error.message))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0) return
    setIsLoading(true)
    try {
      const result = await signInWithPhone(formData.phone)
      if (result.success) { setResendTimer(60); toast({ title: "Code Resent" }) }
      else setAuthError(friendlyError(result.error || ''))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 selection:bg-white selection:text-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.04)_0%,transparent_60%)]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[440px] relative z-10"
      >
        {/* Brand */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-[10px] uppercase tracking-[0.4em] text-white/30 hover:text-white/60 transition-colors mb-6">
            ← Back to Vave
          </Link>
          <h1 className="text-4xl font-serif text-white mb-2">Create Account</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-[0.25em]">Join the Vave family</p>
        </div>

        <div className="bg-zinc-900 border border-white/10 overflow-hidden">
          {/* Loading bar */}
          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="p-8 sm:p-10">
            {/* Tabs — only on initial step */}
            {step === "form" && (
              <div className="flex mb-8 border border-white/8 bg-zinc-950/50">
                {(["email", "phone"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => { setActiveTab(tab); setStep("form"); setAuthError(undefined); setFieldErrors({}) }}
                    className={`flex-1 py-3 text-[10px] uppercase tracking-[0.25em] font-bold transition-all ${activeTab === tab ? 'bg-white text-zinc-950' : 'text-zinc-500 hover:text-white'}`}
                  >
                    {tab === "email" ? "Email" : "Phone / OTP"}
                  </button>
                ))}
              </div>
            )}

            {/* Step indicator for phone flow */}
            {activeTab === "phone" && step !== "form" && (
              <div className="flex items-center gap-2 mb-8">
                {["Send OTP", "Verify", "Profile"].map((s, i) => {
                  const stepIdx = step === "otp" ? 1 : step === "details" ? 2 : 0
                  return (
                    <div key={i} className="flex items-center gap-2 flex-1">
                      <div className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${i <= stepIdx ? 'bg-white text-zinc-950' : 'bg-white/10 text-zinc-500'}`}>
                        {i < stepIdx ? <CheckCircle2 size={12} /> : i + 1}
                      </div>
                      <span className={`text-[9px] uppercase tracking-widest ${i === stepIdx ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
                      {i < 2 && <div className={`h-[1px] flex-1 ${i < stepIdx ? 'bg-white/30' : 'bg-white/10'}`} />}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Error */}
            <AnimatePresence>
              {authError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 flex items-start gap-3 rounded-sm"
                >
                  <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-red-400">{authError.message}</p>
                    {authError.action === 'login' && (
                      <Link href="/auth/login" className="text-xs text-white underline mt-2 inline-flex items-center gap-1 hover:text-zinc-300 transition-colors">
                        Sign in instead <ArrowRight size={10} />
                      </Link>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* ——— EMAIL REGISTER ——— */}
              {activeTab === "email" && step === "form" && (
                <motion.form key="email-reg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleEmailRegister} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><User size={11} /> Full Name</label>
                    <Input name="name" placeholder="Your Full Name" value={formData.name} onChange={change} disabled={isLoading}
                      className={`bg-zinc-950 border-white/10 text-white h-12 rounded-none focus:border-white/30 focus:ring-0 placeholder:text-zinc-600 ${fieldErrors.name ? 'border-red-500' : ''}`} />
                    {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><Mail size={11} /> Email Address</label>
                    <Input name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={change} disabled={isLoading}
                      className={`bg-zinc-950 border-white/10 text-white h-12 rounded-none focus:border-white/30 focus:ring-0 placeholder:text-zinc-600 ${fieldErrors.email ? 'border-red-500' : ''}`} />
                    {fieldErrors.email && <p className="text-xs text-red-400">{fieldErrors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><Lock size={11} /> Password</label>
                    <div className="relative">
                      <Input name="password" type={showPassword ? "text" : "password"} placeholder="Min. 6 characters" value={formData.password} onChange={change} disabled={isLoading}
                        className={`bg-zinc-950 border-white/10 text-white h-12 rounded-none focus:border-white/30 focus:ring-0 placeholder:text-zinc-600 pr-12 ${fieldErrors.password ? 'border-red-500' : ''}`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                    {fieldErrors.password && <p className="text-xs text-red-400">{fieldErrors.password}</p>}
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold mt-2">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Account...</> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>

                  <div className="relative my-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/8" /></div>
                    <div className="relative flex justify-center"><span className="bg-zinc-900 px-4 text-[10px] uppercase tracking-widest text-zinc-600">or</span></div>
                  </div>
                  <Button type="button" variant="outline" onClick={() => loginWithGoogle("/profile")} disabled={isLoading}
                    className="w-full bg-transparent border-white/10 hover:border-white/30 hover:bg-white/5 text-white h-12 rounded-none text-[10px] uppercase tracking-[0.25em] font-medium">
                    <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                    Continue with Google
                  </Button>
                </motion.form>
              )}

              {/* ——— PHONE: SEND OTP ——— */}
              {activeTab === "phone" && step === "form" && (
                <motion.form key="phone-send" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><Phone size={11} /> Mobile Number</label>
                    <Input name="phone" type="tel" placeholder="+91 98765 43210" value={formData.phone} onChange={change} disabled={isLoading}
                      className={`bg-zinc-950 border-white/10 text-white h-12 rounded-none focus:border-white/30 focus:ring-0 placeholder:text-zinc-600 text-base ${fieldErrors.phone ? 'border-red-500' : ''}`} />
                    {fieldErrors.phone && <p className="text-xs text-red-400">{fieldErrors.phone}</p>}
                    <p className="text-[10px] text-zinc-600 uppercase tracking-widest">We'll send a 6-digit SMS code</p>
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</> : 'Send OTP'}
                  </Button>
                </motion.form>
              )}

              {/* ——— PHONE: VERIFY OTP ——— */}
              {activeTab === "phone" && step === "otp" && (
                <motion.form key="phone-otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-sm p-3 flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-400">OTP sent to <span className="font-semibold">{otpSentTo}</span></p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><Hash size={11} /> Enter OTP Code</label>
                    <Input name="otp" type="text" inputMode="numeric" placeholder="000000" maxLength={6}
                      value={formData.otp}
                      onChange={e => { setFormData(p => ({...p, otp: e.target.value.replace(/\D/g, '')})); setFieldErrors({}) }}
                      disabled={isLoading}
                      className={`bg-zinc-950 border-white/10 text-white h-14 rounded-none focus:border-white/30 focus:ring-0 text-center text-2xl tracking-[0.5em] font-mono ${fieldErrors.otp ? 'border-red-500' : ''}`} />
                    {fieldErrors.otp && <p className="text-xs text-red-400 text-center">{fieldErrors.otp}</p>}
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : 'Verify Code'}
                  </Button>
                  <button type="button" onClick={handleResendOtp} disabled={isLoading || resendTimer > 0}
                    className="w-full text-center text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white disabled:opacity-40 transition-colors">
                    {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code'}
                  </button>
                </motion.form>
              )}

              {/* ——— PHONE: SAVE NAME ——— */}
              {step === "details" && (
                <motion.form key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSaveDetails} className="space-y-5">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-sm p-3 flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                    <p className="text-xs text-emerald-400 font-medium">Phone verified! Just one more step.</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2"><User size={11} /> Your Name</label>
                    <Input name="name" placeholder="Your Full Name" value={formData.name} onChange={change} disabled={isLoading}
                      className={`bg-zinc-950 border-white/10 text-white h-12 rounded-none focus:border-white/30 focus:ring-0 placeholder:text-zinc-600 ${fieldErrors.name ? 'border-red-500' : ''}`} />
                    {fieldErrors.name && <p className="text-xs text-red-400">{fieldErrors.name}</p>}
                  </div>
                  <Button type="submit" disabled={isLoading}
                    className="w-full bg-white text-zinc-950 hover:bg-zinc-100 h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <>Complete Profile <ArrowRight className="ml-2 h-4 w-4" /></>}
                  </Button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>

          <div className="border-t border-white/8 px-10 py-5 bg-white/[0.02] text-center">
            <p className="text-[11px] text-zinc-500 uppercase tracking-[0.2em]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white font-bold hover:text-zinc-300 transition-colors ml-1 underline underline-offset-4 decoration-white/20">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="h-6 w-6 animate-spin text-white/30" />
      </div>
    }>
      <RegisterForm />
    </Suspense>
  )
}
