"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Truck,
  ImageIcon,
  Mail,
  BarChart4,
  DollarSign,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/components/ui/use-toast"
import { adminService } from "@/src/lib/adminService"
import { supabase } from "@/src/lib/supabaseClient"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)

    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const adminStatus = await adminService.isAdmin()
        setIsAdmin(adminStatus)
        if (!adminStatus && pathname !== "/admin") {
          router.push('/admin')
          toast({
            title: "Access Denied",
            description: "You don't have permission to access this page",
            variant: "destructive"
          })
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push('/admin')
      } finally {
        setIsLoading(false)
      }
    }

    checkAdmin()
  }, [pathname, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      })
      router.push("/admin")
    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: "Error",
        description: "Failed to logout",
        variant: "destructive"
      })
    }
  }

  const navItems = [
    { href: "/admin/orders", label: "Orders", icon: <ShoppingBag className="h-5 w-5" /> },
    { href: "/admin/products", label: "Products", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/customers", label: "Customers", icon: <Users className="h-5 w-5" /> },
    { href: "/admin/inventory", label: "Inventory", icon: <Package className="h-5 w-5" /> },
    { href: "/admin/shipping", label: "Shipping", icon: <Truck className="h-5 w-5" /> },
    { href: "/admin/gallery", label: "Gallery", icon: <ImageIcon className="h-5 w-5" /> },
    { href: "/admin/messages", label: "Messages", icon: <Mail className="h-5 w-5" /> },
    { href: "/admin/sales", label: "Sales", icon: <BarChart4 className="h-5 w-5" /> },
    { href: "/admin/expenses", label: "Expenses", icon: <DollarSign className="h-5 w-5" /> },
    { href: "/admin/settings", label: "Settings", icon: <Settings className="h-5 w-5" /> },
  ]

  // Don't render anything on the server to avoid hydration mismatch
  if (!mounted) return null

  // Check if we're on the login page
  if (pathname === "/admin") {
    return children
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-2">
        <div className="flex items-center justify-between">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="h-full flex flex-col">
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                  <Link href="/admin/orders" className="text-xl font-bold">
                    VAVE Admin
                  </Link>
                </div>
                <div className="flex-1 overflow-y-auto py-4 px-3">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`flex items-center p-2 rounded-lg ${
                            pathname === item.href
                              ? "bg-accent text-white"
                              : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          {item.icon}
                          <span className="ml-3">{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    className="flex items-center justify-between w-full p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    onClick={handleLogout}
                  >
                    <div className="flex items-center">
                      <LogOut className="h-5 w-5" />
                      <span className="ml-3">Logout</span>
                    </div>
                  </button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <div className="text-lg font-semibold">
            {navItems.find((item) => item.href === pathname)?.label || "Admin"}
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen hidden lg:block w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <Link href="/admin/orders" className="text-xl font-bold">
              VAVE Admin
            </Link>
          </div>

          <div className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg ${
                      pathname === item.href
                        ? "bg-accent text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                    {pathname === item.href && <ChevronRight className="ml-auto h-4 w-4" />}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center mb-3">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{localStorage.getItem("adminEmail") || "Admin User"}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
            <button
              className="flex items-center justify-between w-full p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              onClick={handleLogout}
            >
              <div className="flex items-center">
                <LogOut className="h-5 w-5" />
                <span className="ml-3">Logout</span>
              </div>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64 pt-16 lg:pt-0 p-4 sm:p-6 lg:p-8">{children}</div>
    </div>
  )
}
