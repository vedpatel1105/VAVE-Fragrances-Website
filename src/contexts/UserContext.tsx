"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  addresses?: Address[]
}

interface Address {
  id: string
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

interface UserContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  addAddress: (address: Omit<Address, "id">) => void
  updateAddress: (address: Address) => void
  removeAddress: (id: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll just simulate a successful login
      // In a real app, you would validate credentials against a backend
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: email.split("@")[0], // Use part of email as name for demo
        email: email,
        addresses: [],
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      // For demo purposes, we'll just simulate a successful registration
      const mockUser: User = {
        id: "user_" + Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        addresses: [],
      }

      setUser(mockUser)
      localStorage.setItem("user", JSON.stringify(mockUser))
      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  const addAddress = (addressData: Omit<Address, "id">) => {
    if (!user) return

    const newAddress: Address = {
      ...addressData,
      id: "addr_" + Math.random().toString(36).substr(2, 9),
    }

    // If this is the first address or marked as default, make it the default
    if (!user.addresses || user.addresses.length === 0 || newAddress.isDefault) {
      // Make all other addresses non-default
      const updatedAddresses = user.addresses ? user.addresses.map((addr) => ({ ...addr, isDefault: false })) : []

      // Add the new address
      updatedAddresses.push(newAddress)

      const updatedUser = { ...user, addresses: updatedAddresses }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    } else {
      // Just add the new address without changing defaults
      const updatedAddresses = [...(user.addresses || []), newAddress]
      const updatedUser = { ...user, addresses: updatedAddresses }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const updateAddress = (updatedAddress: Address) => {
    if (!user || !user.addresses) return

    // If setting this address as default, make all others non-default
    let updatedAddresses: Address[]
    if (updatedAddress.isDefault) {
      updatedAddresses = user.addresses.map((addr) =>
        addr.id === updatedAddress.id ? updatedAddress : { ...addr, isDefault: false },
      )
    } else {
      updatedAddresses = user.addresses.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
    }

    const updatedUser = { ...user, addresses: updatedAddresses }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  const removeAddress = (id: string) => {
    if (!user || !user.addresses) return

    const updatedAddresses = user.addresses.filter((addr) => addr.id !== id)
    const updatedUser = { ...user, addresses: updatedAddresses }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        addAddress,
        updateAddress,
        removeAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
