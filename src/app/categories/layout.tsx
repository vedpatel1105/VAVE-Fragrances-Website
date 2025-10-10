import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.categories()

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
