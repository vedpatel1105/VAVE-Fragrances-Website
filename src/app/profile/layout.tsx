import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.profile()

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
