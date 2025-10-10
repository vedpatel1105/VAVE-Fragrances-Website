import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.privacy()

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
