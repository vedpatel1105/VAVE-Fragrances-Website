import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.about()

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
