import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = metadataGenerators.influencerCollaboration()

export default function InfluencerCollaborationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}