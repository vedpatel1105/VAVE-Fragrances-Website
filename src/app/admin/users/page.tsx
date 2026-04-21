"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Search, Shield, ShieldOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { adminService, User } from "@/src/lib/adminService"
import AdminNavbar from "@/src/app/components/AdminNavbar"

export default function AdminUsersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is admin
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const isAdmin = await adminService.isAdmin()
        const isViewer = await adminService.isViewer()

        if (isViewer && !isAdmin) {
          router.push('/admin/analytics')
          return
        }

        if (!isAdmin) {
          router.push('/')
          return
        }
      } catch (error) {
        console.error('Error checking admin status:', error)
        router.push('/')
      }
    }

    checkAdmin()
  }, [router])

  // Load users
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers()
      setUsers(data)
    } catch (error) {
      console.error('Error loading users:', error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filter users based on search
  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return user.email.toLowerCase().includes(query)
  })

  // Toggle admin role
  const toggleAdminRole = async (user: User) => {
    try {
      if (user.role === 'admin') {
        await adminService.removeAdminRole(user.id)
        toast({
          title: "Success",
          description: "Admin role removed successfully"
        })
      } else {
        await adminService.setUserAsAdmin(user.id)
        toast({
          title: "Success",
          description: "User is now an admin"
        })
      }
      await loadUsers()
    } catch (error) {
      console.error('Error toggling admin role:', error)
      toast({
        title: "Error",
        description: "Failed to update user role",
        variant: "destructive"
      })
    }
  }

  // Export CSV function
  const exportToCSV = () => {
    if (!users.length) {
      toast({ title: "No data", description: "There are no users to export.", variant: "destructive" })
      return
    }

    const headers = ["User ID", "Email", "Role", "Joined Date"]
    const rows = filteredUsers.map(u => [
      u.id,
      u.email,
      u.role,
      new Date(u.created_at).toLocaleString()
    ])

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `vave_users_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <AdminNavbar />
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin opacity-50" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-white selection:text-black">
      <AdminNavbar />
      <div className="container mx-auto py-8 px-6 pt-32 pb-20 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-8">
            <div>
              <h1 className="text-4xl font-serif mb-2 tracking-tight">Client Directory</h1>
              <p className="text-zinc-500 font-light text-sm">Manage VIPs, clients, and team access.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative flex-1 min-w-[300px]">
                <Input
                  type="text"
                  placeholder="Search by email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 h-12 bg-zinc-900/50 border-white/5 rounded-xl text-white placeholder:text-zinc-600 focus:ring-gold/30"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-500 h-4 w-4" />
              </div>

              <Button 
                onClick={exportToCSV}
                className="h-12 px-6 bg-white text-black font-bold rounded-xl hover:bg-gold hover:text-dark transition-colors whitespace-nowrap"
              >
                Export CSV
              </Button>
            </div>
          </div>

          <div className="bg-zinc-900/30 backdrop-blur-md border border-white/5 rounded-[2rem] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/5">
                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-1/3">
                      Client ID
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Access Level
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      Member Since
                    </th>
                    <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">
                      Privileges
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-12 text-center text-zinc-600 font-light italic">
                        No clients found matching that email.
                      </td>
                    </tr>
                  ) : filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {user.email}
                        </div>
                        <div className="text-[10px] font-mono text-zinc-600 mt-1">
                          {user.id.slice(0, 8)}...
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                          user.role === 'admin' 
                            ? 'bg-gold/10 text-gold border-gold/20' 
                            : user.role === 'viewer'
                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                            : 'bg-zinc-800 text-zinc-400 border-white/5'
                        }`}>
                          {user.role}
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-zinc-500">
                        {new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAdminRole(user)}
                          className={`h-9 px-4 rounded-xl text-xs font-medium transition-colors border ${
                            user.role === 'admin'
                              ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20 hover:text-red-300'
                              : 'bg-white/5 text-zinc-300 border-white/5 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {user.role === 'admin' ? (
                            <>
                              <ShieldOff className="h-3 w-3 mr-2" />
                              Revoke Admin
                            </>
                          ) : (
                            <>
                              <Shield className="h-3 w-3 mr-2" />
                              Grant Admin
                            </>
                          )}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
 