import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.trackOrder()

export default function TrackOrderLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
