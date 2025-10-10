import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = {
  title: "Order Success - Thank You for Your Purchase | VAVE Fragrances",
  description: "Thank you for your order! Your VAVE fragrance purchase has been confirmed. Track your order and explore more premium fragrances.",
  keywords: "order success, purchase confirmed, thank you, fragrance order, order tracking, VAVE fragrances",
  openGraph: {
    title: "Order Success - Thank You for Your Purchase | VAVE Fragrances",
    description: "Thank you for your order! Your VAVE fragrance purchase has been confirmed.",
    type: "website",
    url: `${metadataGenerators.home().openGraph?.url}/order-success`,
  },
}

export default function OrderSuccessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
