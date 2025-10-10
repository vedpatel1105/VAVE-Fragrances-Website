import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.help()

export default function HelpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
