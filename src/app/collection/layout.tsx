import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.collection()

export default function CollectionLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
