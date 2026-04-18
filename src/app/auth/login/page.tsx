"use client"

import type React from "react"
import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuthStore } from "@/src/lib/auth"

function LoginForm() {
  const { login, loginWithGoogle, isAuthenticated } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailForm, setEmailForm] = useState({ email: "", password: "" })
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [loginError, setLoginError] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get redirect URL from query params
  const redirectTo = searchParams.get('redirect') || '/profile'

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated) {
      router.replace(redirectTo)
    }
  }, [isAuthenticated, redirectTo, router])

  // Show error from OAuth redirect if present
  useEffect(() => {
    const error = searchParams.get('error')
    if (error) {
      const details = searchParams.get('details')
      setLoginError(details || `Authentication error: ${error}`)
    }
  }, [searchParams])

  const validateForm = (): boolean => {
    const errors: { email?: string; password?: string } = {}

    if (!emailForm.email.trim()) {
      errors.email = "Email address is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    if (!emailForm.password) {
      errors.password = "Password is required"
    } else if (emailForm.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Map Supabase error messages to user-friendly text
  const getUserFriendlyError = (errorMessage: string): string => {
    if (errorMessage.includes("Invalid login credentials")) {
      return "Incorrect email or password. Please try again."
    }
    if (errorMessage.includes("Email not confirmed")) {
      return "Please verify your email address. Check your inbox for a confirmation link."
    }
    if (errorMessage.includes("Too many requests")) {
      return "Too many login attempts. Please wait a moment and try again."
    }
    if (errorMessage.includes("User not found")) {
      return "No account found with this email. Would you like to sign up?"
    }
    return errorMessage || "An unexpected error occurred. Please try again."
  }

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError("")

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const result = await login(emailForm.email, emailForm.password)

      if (!result.success) {
        setLoginError(getUserFriendlyError(result.error || ""))
        return
      }

      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully.",
      })

      // Use replace for reliable redirect
      window.location.replace(redirectTo)
    } catch (error: any) {
      setLoginError(getUserFriendlyError(error.message || ""))
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
      setLoginError(getUserFriendlyError(error.message || ""))
      setIsLoading(false)
    }
  }

  // Clear field error when user starts typing
  const handleFieldChange = (field: 'email' | 'password', value: string) => {
    setEmailForm(prev => ({ ...prev, [field]: value }))
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: undefined }))
    }
    if (loginError) setLoginError("")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 font-mono">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] pointer-events-none" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md bg-zinc-900 border border-white/5 rounded-none shadow-2xl overflow-hidden relative z-10"
      >
        <div className="p-10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/40">Sign in to your luxury sanctuary</p>
          </div>

          {/* Global login error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-6 p-4 rounded-none bg-red-500/10 border border-red-500/20 flex items-start gap-3"
            >
              <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
              <p className="text-[11px] text-red-400 uppercase tracking-wider leading-relaxed">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-[0.2em] text-white/50 ml-1">Email Address</label>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="name@example.com"
                  className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10 ${fieldErrors.email ? 'border-red-500/50' : ''}`}
                  value={emailForm.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  autoComplete="email"
                />
              </div>
              {fieldErrors.email && (
                <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.email}</p>
              )}
            </div>

            <div className="space-y-2">
               <div className="flex justify-between items-end px-1">
                <label className="text-[9px] uppercase tracking-[0.2em] text-white/50">Password</label>
                <Link href="/forgot-password" size="sm" className="text-[9px] uppercase tracking-[0.2em] text-white/30 hover:text-white transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`bg-zinc-950 border-white/10 text-white rounded-none h-12 focus:border-white/30 focus:ring-0 transition-all placeholder:text-white/10 ${fieldErrors.password ? 'border-red-500/50' : ''}`}
                  value={emailForm.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="text-[9px] text-red-500/80 uppercase tracking-widest ml-1">{fieldErrors.password}</p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white hover:bg-zinc-200 text-black h-12 rounded-none text-[11px] uppercase tracking-[0.3em] font-bold shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all duration-500" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign In
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
                <span className="bg-zinc-900 px-4">Or Discover Social Join</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full border-white/10 hover:border-white/30 hover:bg-white/5 text-white h-12 rounded-none text-[10px] uppercase tracking-[0.2em] transition-all" 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
            >
              <Image src="/google-logo.svg" alt="Google" width={18} height={18} className="mr-3 opacity-80" />
              Sign in with Google
            </Button>
          </div>
        </div>

        <div className="p-6 bg-white/5 border-t border-white/5 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-white hover:text-white/70 transition-colors font-bold ml-1">
              Create One
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
