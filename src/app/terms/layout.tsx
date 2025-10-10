import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.terms()

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
