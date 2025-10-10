import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.business()

export default function BusinessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
