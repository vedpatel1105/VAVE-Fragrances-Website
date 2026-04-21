"use client"

import dynamic from "next/dynamic"

// Dynamically import Cart with ssr:false inside a Client Component — this is fully legal
const Cart = dynamic(() => import("@/src/app/components/Cart"), { ssr: false })

export default function GlobalCart() {
  return <Cart />
}
