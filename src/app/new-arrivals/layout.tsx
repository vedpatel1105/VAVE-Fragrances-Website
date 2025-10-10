import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.newArrivals()

export default function NewArrivalsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
