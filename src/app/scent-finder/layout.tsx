import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.scentFinder()

export default function ScentFinderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
