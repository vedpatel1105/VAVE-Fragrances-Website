import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.checkout()

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
