import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.contact()

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
