import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.gallery()

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
