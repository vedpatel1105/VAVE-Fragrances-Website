import type { Metadata } from "next"
import { generateProductMetadata } from "@/src/lib/metadata"
import { ProductInfo } from "@/src/data/product-info"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params  
  const product = ProductInfo.getProductById(resolvedParams.id)

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
