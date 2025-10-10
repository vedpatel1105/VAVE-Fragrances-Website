import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.myOrders()

export default function MyOrdersLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
