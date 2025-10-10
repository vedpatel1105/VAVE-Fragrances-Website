import type { Metadata } from "next"
import { generateProductMetadata } from "@/src/lib/metadata"
import { ProductInfo } from "@/src/data/product-info"

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const product = ProductInfo.allProductItems?.find((p) => p.id.toString() === params.id)

  if (!product) {
    return {
      title: "Product Not Found | VAVE Fragrances",
      description: "The requested product could not be found.",
    }
  }

  return generateProductMetadata(product)
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
