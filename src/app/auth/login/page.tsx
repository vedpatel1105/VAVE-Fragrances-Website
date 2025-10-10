"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/src/lib/supabaseClient"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/src/lib/auth"

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [emailForm, setEmailForm] = useState({ email: "", password: "" })
  const [phoneForm, setPhoneForm] = useState({ phone: "", otp: "" })
  const [otpSent, setOtpSent] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const router = useRouter()
  const { toast } = useToast()

  // Handle email login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { error, user } = await login(emailForm.email, emailForm.password)

      if (error) throw error

      // Get user profile from profiles table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError
      }

      // If profile doesn't exist, create one
      if (!profile && user) {
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: user?.id,
              email: user?.email,
              full_name: user?.user_metadata?.full_name || "",
            },
          ])

        if (insertError) throw insertError
      }

      toast({
        title: "Login Successful",
        description: "Welcome back to Vave Fragrances!",
      })

      // Get the redirect URL from the query parameters
      const params = new URLSearchParams(window.location.search)
      const redirectTo = params.get('redirect') || '/profile'
      // Use window.location.replace for reliability
      window.location.replace(redirectTo)
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true)

      // Get the redirect URL from the query parameters
      const params = new URLSearchParams(window.location.search)
      const redirectPath = params.get('redirect') || '/profile'

      // Always pass the redirect param to callback
      await loginWithGoogle(redirectPath)

      // The user will be redirected to Google's login page
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Failed to login with Google. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
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

          <Tabs defaultValue="email">

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="email"
                      placeholder="Email address"
                      className="pl-10"
                      value={emailForm.email}
                      onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      className="pl-10 pr-10"
                      value={emailForm.password}
                      onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <Link href="/auth/forgot-password" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
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
            </TabsContent>
          </Tabs>

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
              <Button className="w-full" onClick={handleGoogleLogin} disabled={isLoading}>
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
