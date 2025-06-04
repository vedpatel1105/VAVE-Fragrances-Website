"use client"

import { useState } from "react"
import SimpleNavbar from "@/src/app/components/SimpleNavbar"
import StoreLocator from "@/src/app/components/StoreLocator"
import Footer from "@/src/app/components/Footer"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb"
import { ChevronRight, Home } from "lucide-react"

export default function FindStorePage() {
  const [isCartOpen, setIsCartOpen] = useState(false)

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <SimpleNavbar setIsCartOpen={setIsCartOpen} />

      <div className="pt-24 pb-8 px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
        <div className="container mx-auto">
         

         
        </div>
      </div>

      <StoreLocator />

      <Footer />
    </main>
  )
}
