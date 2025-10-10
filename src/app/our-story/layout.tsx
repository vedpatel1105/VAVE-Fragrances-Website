import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.ourStory()

export default function OurStoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
