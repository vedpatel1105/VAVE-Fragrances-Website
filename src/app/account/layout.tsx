import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.account()

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
