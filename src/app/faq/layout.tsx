import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.faq()

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
