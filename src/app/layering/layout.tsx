import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.layering()

export default function LayeringLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
