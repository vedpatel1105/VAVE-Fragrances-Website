import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.craftsmanship()

export default function CraftsmanshipLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
