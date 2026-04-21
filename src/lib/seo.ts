import type { Metadata } from "next"

const SITE_CONFIG = {
  name: "Vave Fragrances",
  description: "Experience the luxury of premium Indian fragrances. Artisanal attars and perfumes crafted for the modern soul.",
  url: "https://vavefragrances.com",
  ogImage: "https://vavefragrances.com/og-image.jpg",
  twitterHandle: "@vavefragrances",
}

export function constructMetadata({
  title = SITE_CONFIG.name,
  description = SITE_CONFIG.description,
  image = SITE_CONFIG.ogImage,
  icons = "/favicon.ico",
  noIndex = false,
}: {
  title?: string
  description?: string
  image?: string
  icons?: string
  noIndex?: boolean
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | ${SITE_CONFIG.name}`
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: SITE_CONFIG.twitterHandle,
    },
    icons,
    metadataBase: new URL(SITE_CONFIG.url),
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  }
}
