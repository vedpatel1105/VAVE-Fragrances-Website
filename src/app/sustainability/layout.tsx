import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.sustainability()

export default function SustainabilityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
