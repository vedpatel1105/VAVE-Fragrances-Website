import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.wishlist()

export default function WishlistLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
