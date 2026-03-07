"use client"

import type React from "react"
import { useState, useEffect } from "react"
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

export default function LoginPage() {
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
      >
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Welcome to Vave</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your account</p>
          </div>

          {/* Global login error */}
          {loginError && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-start gap-2"
            >
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700 dark:text-red-300">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="email"
                  placeholder="Email address"
                  className={`pl-10 ${fieldErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={emailForm.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                  autoComplete="email"
                  aria-invalid={!!fieldErrors.email}
                />
                {emailForm.email && !fieldErrors.email && (
                  <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
                )}
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`pl-10 pr-10 ${fieldErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  value={emailForm.password}
                  onChange={(e) => handleFieldChange('password', e.target.value)}
                  autoComplete="current-password"
                  aria-invalid={!!fieldErrors.password}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.password}</p>
              )}
              <div className="flex justify-end mt-1">
                <Link href="/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                <span className="flex items-center">
                  Sign in
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
                <Image src="/google-logo.svg" alt="Google" width={20} height={20} className="mr-2" />
                Google
              </Button>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-700 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link href="/auth/register" className="text-accent font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
