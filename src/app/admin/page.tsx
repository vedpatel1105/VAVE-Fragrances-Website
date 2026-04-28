"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Terminal, ClipboardIcon, CheckIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { adminService } from "@/src/lib/adminService"
import { supabase, isSupabaseConfigured } from "@/src/lib/supabaseClient"
import { useAuthStore } from "@/src/lib/auth"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [form, setForm] = useState({ email: "", password: "" })
  const router = useRouter()
  const { toast } = useToast()

  // Gracefully handle missing configuration
  if (!isSupabaseConfigured) {
    const handleCopy = () => {
      navigator.clipboard.writeText("npm run dev")
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    }

    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-zinc-900/50 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-12 text-center shadow-[0_0_50px_rgba(255,215,0,0.05)]"
        >
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-amber-500/20">
            <AlertCircle className="h-10 w-10 text-amber-500" />
          </div>
          
          <h1 className="text-4xl font-serif text-white mb-4">Setup Required</h1>
          <p className="text-zinc-400 mb-12 max-w-md mx-auto">
            Your Vave Admin Suite is ready but requires its connection keys to access the database.
          </p>

          <div className="space-y-6 text-left mb-12">
            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm italic">
                <Terminal className="h-4 w-4 text-gold" /> Step 1: Add your Anon Key
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                I've already created a <strong>.env.local</strong> file in your project root. 
                Open it and replace <code className="text-gold">paste_your_anon_key_here</code> with your Supabase Anon Key.
              </p>
            </div>

            <div className="bg-black/40 rounded-2xl p-6 border border-white/5">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2 text-sm italic">
                <Terminal className="h-4 w-4 text-gold" /> Step 2: Restart Server
              </h3>
              <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                Save the file, then stop your terminal (Ctrl+C) and run the command below to reconnect.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleCopy}
                className="bg-white/5 border-white/10 text-[9px] uppercase tracking-widest h-10 px-4 rounded-xl hover:bg-white/10 transition-all font-mono"
              >
                {isCopied ? <CheckIcon className="h-3 w-3 mr-2" /> : <ClipboardIcon className="h-3 w-3 mr-2" />}
                {isCopied ? "Copied" : "npm run dev"}
              </Button>
            </div>
          </div>

          <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-medium">
            Vave Fragrances • System Offline
          </p>
        </motion.div>
      </div>
    )
  }

  // Only initialize when configured to prevent runtime throw
  // @ts-ignore

  const { login } = useAuthStore()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(form.email, form.password)

      if (!result.success) {
        throw new Error(result.error || "Invalid credentials")
      }

      if (result.user) {
        const isAdmin = await adminService.isAdmin()
        const isViewer = await adminService.isViewer()

        if (!isViewer) {
          await useAuthStore.getState().logout()
          throw new Error("Unauthorized access")
        }

        toast({
          title: "Access Granted",
          description: "Welcome to Vave Elite",
        })

        if (isAdmin) {
          router.push('/admin/orders')
        } else {
          router.push('/admin/analytics')
        }
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 overflow-hidden">
      {/* Cinematic Accents */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-zinc-900/40 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 md:p-14 shadow-2xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-serif text-white mb-4 tracking-tight">Vave Elite</h1>
            <div className="h-0.5 w-12 bg-gold mx-auto mb-4" />
            <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] font-bold">Management Access</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Authorized Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                <Input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-16 pl-14 bg-black/40 border-white/5 rounded-2xl text-white placeholder:text-zinc-800 focus:border-gold/30 focus:ring-gold/5 transition-all"
                  placeholder="admin@vavefragrances.com"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-focus-within:text-gold transition-colors" />
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="h-16 pl-14 pr-14 bg-black/40 border-white/5 rounded-2xl text-white placeholder:text-zinc-800 focus:border-gold/30 focus:ring-gold/5 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-16 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-2xl hover:bg-gold hover:text-dark transition-all duration-700 flex items-center justify-center gap-2 group shadow-xl hover:shadow-gold/10"
            >
              {isLoading ? "Validating Signature..." : (
                <>
                  Establish Connection
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[9px] text-zinc-600 uppercase tracking-[0.4em] font-bold">
              Protected by Vave Security • 2025
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}