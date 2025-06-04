"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

export default function LoginPage() {
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
      // In a real app, this would be an API call to authenticate
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user123",
          name: "John Doe",
          email: emailForm.email,
          phone: "+91 9876543210",
          isLoggedIn: true,
        }),
      )

      toast({
        title: "Login Successful",
        description: "Welcome back to Vave Fragrances!",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle phone login - send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to send OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setOtpSent(true)
      setCountdown(30)

      // Start countdown
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)

      toast({
        title: "OTP Sent",
        description: `A verification code has been sent to ${phoneForm.phone}`,
      })
    } catch (error) {
      toast({
        title: "Failed to Send OTP",
        description: "Please check your phone number and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle phone login - verify OTP
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, this would be an API call to verify OTP
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user123",
          name: "John Doe",
          email: "john.doe@example.com",
          phone: phoneForm.phone,
          isLoggedIn: true,
        }),
      )

      toast({
        title: "Login Successful",
        description: "Welcome back to Vave Fragrances!",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle Google login
  const handleGoogleLogin = async () => {
    setIsLoading(true)

    try {
      // In a real app, this would redirect to Google OAuth
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful login
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: "user123",
          name: "John Doe",
          email: "john.doe@gmail.com",
          phone: "+91 9876543210",
          isLoggedIn: true,
        }),
      )

      toast({
        title: "Login Successful",
        description: "Welcome back to Vave Fragrances!",
      })

      router.push("/profile")
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Failed to login with Google. Please try again.",
        variant: "destructive",
      })
    } finally {
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
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="phone">Phone</TabsTrigger>
            </TabsList>

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
                    <Link href="/auth/forgot-password" className="text-sm text-accent hover:underline">
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

            <TabsContent value="phone">
              {!otpSent ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <Input
                      type="tel"
                      placeholder="Phone number"
                      className="pl-10"
                      value={phoneForm.phone}
                      onChange={(e) => setPhoneForm({ ...phoneForm, phone: e.target.value })}
                      required
                    />
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
                        Sending OTP...
                      </span>
                    ) : (
                      <span>Send OTP</span>
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Enter the OTP sent to {phoneForm.phone}
                    </p>
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={phoneForm.otp}
                      onChange={(e) => setPhoneForm({ ...phoneForm, otp: e.target.value })}
                      required
                      maxLength={6}
                      className="text-center text-lg tracking-widest"
                    />
                    <div className="flex justify-between mt-2">
                      <button
                        type="button"
                        className="text-sm text-accent hover:underline"
                        onClick={() => setOtpSent(false)}
                      >
                        Change number
                      </button>
                      <button
                        type="button"
                        className="text-sm text-accent hover:underline"
                        onClick={handleSendOTP}
                        disabled={countdown > 0 || isLoading}
                      >
                        {countdown > 0 ? `Resend in ${countdown}s` : "Resend OTP"}
                      </button>
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
                        Verifying...
                      </span>
                    ) : (
                      <span>Verify & Sign in</span>
                    )}
                  </Button>
                </form>
              )}
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
