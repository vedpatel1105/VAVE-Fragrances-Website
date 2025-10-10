import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.findStore()

export default function FindStoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
