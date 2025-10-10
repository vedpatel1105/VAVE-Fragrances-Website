import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.settings()

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
