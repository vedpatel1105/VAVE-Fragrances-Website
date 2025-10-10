import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.shippingReturns()

export default function ShippingReturnsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
