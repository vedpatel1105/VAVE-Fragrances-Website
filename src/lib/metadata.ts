import type { Metadata } from "next"

// Base site configuration
export const siteConfig = {
  name: "VAVE Fragrances",
  description: "Premium fragrances crafted with 25% perfume oil concentration. Discover our collection of 8 signature scents designed for layering and personal expression.",
  url: "https://vavefragrances.com",
  ogImage: "https://vavefragrances.com/og-image.jpg",
  keywords: [
    "premium fragrances",
    "perfume",
    "eau de parfum",
    "fragrance layering",
    "signature scents",
    "luxury perfume",
    "25% perfume oil",
    "long lasting fragrance",
    "fragrance collection",
    "perfume finder",
    "custom fragrance",
    "fragrance notes",
    "oriental fragrance",
    "woody fragrance",
    "floral fragrance",
    "fresh fragrance",
    "aquatic fragrance",
    "spicy fragrance",
    "gourmand fragrance",
    "citrus fragrance"
  ],
  authors: [
    {
      name: "VAVE Fragrances",
      url: "https://vavefragrances.com",
    },
  ],
  creator: "VAVE Fragrances",
  publisher: "VAVE Fragrances",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

// Product-specific metadata generator
export function generateProductMetadata(product: {
  name: string
  description: string
  category: string
  tagline: string
  price: number
  rating: number
  reviews: number
  notes: { top: string[]; heart: string[]; base: string[] }
  specifications: { fragrance_family: string; longevity: string; sillage: string }
}) {
  const title = `${product.name} - ${product.tagline} | VAVE Fragrances`
  const description = `${product.description} ${product.category} fragrance with ${product.notes.top.join(', ')} top notes. 25% perfume oil concentration, ${product.specifications.longevity} longevity. Rated ${product.rating}/5 by ${product.reviews} customers.`
  
  const keywords = [
    product.name.toLowerCase(),
    product.category.toLowerCase(),
    ...product.notes.top.map(note => note.toLowerCase()),
    ...product.notes.heart.map(note => note.toLowerCase()),
    ...product.notes.base.map(note => note.toLowerCase()),
    product.specifications.fragrance_family.toLowerCase(),
    "premium fragrance",
    "25% perfume oil",
    "long lasting perfume"
  ]

  return {
    title,
    description,
    keywords: keywords.join(", "),
    openGraph: {
      title,
      description,
      type: "website",
      url: `${siteConfig.url}/product/${product.name.toLowerCase().replace(/\s+/g, '-')}`,
      images: [
        {
          url: `${siteConfig.url}/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-og.jpg`,
          width: 1200,
          height: 630,
          alt: `${product.name} - VAVE Fragrances`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteConfig.url}/products/${product.name.toLowerCase().replace(/\s+/g, '-')}-og.jpg`],
    },
  } satisfies Metadata
}

// Page-specific metadata generators
export const metadataGenerators = {
  home: () => ({
    title: "VAVE Fragrances - Premium Perfumes with 25% Oil Concentration",
    description: "Discover VAVE's collection of 8 signature fragrances crafted with 25% perfume oil concentration. Experience layering, scent finder, and premium quality. Free shipping on orders above ₹1000.",
    keywords: [
      "premium fragrances",
      "25% perfume oil",
      "signature scents",
      "fragrance layering",
      "luxury perfume",
      "long lasting fragrance",
      "fragrance collection",
      "perfume finder",
      "custom fragrance",
      "oriental fragrance",
      "woody fragrance",
      "floral fragrance",
      "fresh fragrance",
      "aquatic fragrance",
      "spicy fragrance",
      "gourmand fragrance",
      "citrus fragrance"
    ].join(", "),
    openGraph: {
      title: "VAVE Fragrances - Premium Perfumes with 25% Oil Concentration",
      description: "Discover VAVE's collection of 8 signature fragrances crafted with 25% perfume oil concentration. Experience layering, scent finder, and premium quality.",
      type: "website",
      url: siteConfig.url,
      images: [
        {
          url: `${siteConfig.url}/og-home.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances - Premium Perfumes Collection",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "VAVE Fragrances - Premium Perfumes with 25% Oil Concentration",
      description: "Discover VAVE's collection of 8 signature fragrances crafted with 25% perfume oil concentration.",
      images: [`${siteConfig.url}/og-home.jpg`],
    },
  }),

  about: () => ({
    title: "About VAVE Fragrances - Crafting Signature Scents Since 2025",
    description: "Learn about VAVE Fragrances' mission to empower personal scent expression. Founded in 2025, we offer 8 signature perfumes with 25% oil concentration and unique layering capabilities.",
    keywords: [
      "about vave fragrances",
      "fragrance company",
      "perfume brand",
      "signature scents",
      "25% perfume oil",
      "fragrance layering",
      "personal expression",
      "premium fragrances",
      "fragrance craftsmanship"
    ].join(", "),
    openGraph: {
      title: "About VAVE Fragrances - Crafting Signature Scents Since 2025",
      description: "Learn about VAVE Fragrances' mission to empower personal scent expression. Founded in 2025, we offer 8 signature perfumes with 25% oil concentration.",
      type: "website",
      url: `${siteConfig.url}/about`,
      images: [
        {
          url: `${siteConfig.url}/og-about.jpg`,
          width: 1200,
          height: 630,
          alt: "About VAVE Fragrances - Crafting Signature Scents",
        },
      ],
    },
  }),

  collection: () => ({
    title: "VAVE Fragrance Collection - 8 Signature Scents for Every Mood",
    description: "Explore VAVE's complete fragrance collection featuring 8 signature scents: Havoc, Lavior, Duskfall, Euphoria, Oceane, Velora, Obsession, and Mehfil. Each crafted with 25% perfume oil concentration.",
    keywords: [
      "fragrance collection",
      "signature scents",
      "havoc fragrance",
      "lavior fragrance",
      "duskfall fragrance",
      "euphoria fragrance",
      "oceane fragrance",
      "velora fragrance",
      "obsession fragrance",
      "mehfil fragrance",
      "25% perfume oil",
      "premium fragrances"
    ].join(", "),
    openGraph: {
      title: "VAVE Fragrance Collection - 8 Signature Scents for Every Mood",
      description: "Explore VAVE's complete fragrance collection featuring 8 signature scents crafted with 25% perfume oil concentration.",
      type: "website",
      url: `${siteConfig.url}/collection`,
      images: [
        {
          url: `${siteConfig.url}/og-collection.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrance Collection - 8 Signature Scents",
        },
      ],
    },
  }),

  categories: () => ({
    title: "Fragrance Categories - Floral, Woody, Oriental, Fresh & More | VAVE",
    description: "Discover fragrance categories at VAVE: Floral, Woody, Oriental, Fresh, Aquatic, Spicy, Gourmand, and Citrus. Find your perfect scent family with our premium 25% oil concentration perfumes.",
    keywords: [
      "fragrance categories",
      "floral fragrance",
      "woody fragrance",
      "oriental fragrance",
      "fresh fragrance",
      "aquatic fragrance",
      "spicy fragrance",
      "gourmand fragrance",
      "citrus fragrance",
      "fragrance families",
      "perfume categories"
    ].join(", "),
    openGraph: {
      title: "Fragrance Categories - Floral, Woody, Oriental, Fresh & More | VAVE",
      description: "Discover fragrance categories at VAVE: Floral, Woody, Oriental, Fresh, Aquatic, Spicy, Gourmand, and Citrus.",
      type: "website",
      url: `${siteConfig.url}/categories`,
      images: [
        {
          url: `${siteConfig.url}/og-categories.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrance Categories",
        },
      ],
    },
  }),

  layering: () => ({
    title: "Fragrance Layering Guide - Create Custom Scents | VAVE Fragrances",
    description: "Master the art of fragrance layering with VAVE. Combine any two of our 8 signature scents to create 64 unique combinations. Learn layering techniques and discover popular combinations.",
    keywords: [
      "fragrance layering",
      "custom fragrance",
      "perfume layering",
      "fragrance combinations",
      "signature scents",
      "personalized fragrance",
      "layering guide",
      "fragrance mixing",
      "custom scent",
      "unique combinations"
    ].join(", "),
    openGraph: {
      title: "Fragrance Layering Guide - Create Custom Scents | VAVE Fragrances",
      description: "Master the art of fragrance layering with VAVE. Combine any two of our 8 signature scents to create 64 unique combinations.",
      type: "website",
      url: `${siteConfig.url}/layering`,
      images: [
        {
          url: `${siteConfig.url}/og-layering.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrance Layering Guide",
        },
      ],
    },
  }),

  scentFinder: () => ({
    title: "Scent Finder - Discover Your Perfect Fragrance | VAVE Fragrances",
    description: "Find your perfect fragrance with VAVE's interactive scent finder. Answer questions about your preferences, style, and occasions to get personalized fragrance recommendations.",
    keywords: [
      "scent finder",
      "fragrance finder",
      "perfume finder",
      "fragrance quiz",
      "personalized fragrance",
      "fragrance recommendation",
      "find perfect scent",
      "fragrance matching",
      "scent discovery",
      "fragrance quiz"
    ].join(", "),
    openGraph: {
      title: "Scent Finder - Discover Your Perfect Fragrance | VAVE Fragrances",
      description: "Find your perfect fragrance with VAVE's interactive scent finder. Get personalized recommendations based on your preferences.",
      type: "website",
      url: `${siteConfig.url}/scent-finder`,
      images: [
        {
          url: `${siteConfig.url}/og-scent-finder.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Scent Finder - Discover Your Perfect Fragrance",
        },
      ],
    },
  }),

  contact: () => ({
    title: "Contact VAVE Fragrances - Customer Support & Inquiries",
    description: "Get in touch with VAVE Fragrances for customer support, product inquiries, and assistance. Contact us via email, phone, or our contact form. We're here to help with your fragrance journey.",
    keywords: [
      "contact vave fragrances",
      "customer support",
      "fragrance inquiries",
      "perfume support",
      "customer service",
      "contact information",
      "help center",
      "fragrance assistance"
    ].join(", "),
    openGraph: {
      title: "Contact VAVE Fragrances - Customer Support & Inquiries",
      description: "Get in touch with VAVE Fragrances for customer support, product inquiries, and assistance.",
      type: "website",
      url: `${siteConfig.url}/contact`,
      images: [
        {
          url: `${siteConfig.url}/og-contact.jpg`,
          width: 1200,
          height: 630,
          alt: "Contact VAVE Fragrances",
        },
      ],
    },
  }),

  faq: () => ({
    title: "FAQ - Frequently Asked Questions | VAVE Fragrances",
    description: "Find answers to common questions about VAVE fragrances, orders, shipping, returns, and more. Get help with product information, sizing, layering, and fragrance care.",
    keywords: [
      "vave fragrances faq",
      "frequently asked questions",
      "fragrance faq",
      "perfume questions",
      "shipping faq",
      "returns faq",
      "product information",
      "fragrance care",
      "customer help"
    ].join(", "),
    openGraph: {
      title: "FAQ - Frequently Asked Questions | VAVE Fragrances",
      description: "Find answers to common questions about VAVE fragrances, orders, shipping, returns, and more.",
      type: "website",
      url: `${siteConfig.url}/faq`,
      images: [
        {
          url: `${siteConfig.url}/og-faq.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances FAQ",
        },
      ],
    },
  }),

  ourStory: () => ({
    title: "Our Story - VAVE Fragrances Journey & Philosophy",
    description: "Discover VAVE Fragrances' story, from our founding in 2025 to our commitment to quality, accessibility, and sustainability. Learn about our craftsmanship and fragrance philosophy.",
    keywords: [
      "vave fragrances story",
      "fragrance company history",
      "perfume brand story",
      "fragrance philosophy",
      "quality craftsmanship",
      "sustainability",
      "accessibility",
      "fragrance mission"
    ].join(", "),
    openGraph: {
      title: "Our Story - VAVE Fragrances Journey & Philosophy",
      description: "Discover VAVE Fragrances' story, from our founding in 2025 to our commitment to quality, accessibility, and sustainability.",
      type: "website",
      url: `${siteConfig.url}/our-story`,
      images: [
        {
          url: `${siteConfig.url}/og-our-story.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Our Story",
        },
      ],
    },
  }),

  shippingReturns: () => ({
    title: "Shipping & Returns Policy | VAVE Fragrances",
    description: "Learn about VAVE Fragrances' shipping and returns policy. Free shipping on orders above ₹1000, 30-day return policy, and secure packaging for your fragrances.",
    keywords: [
      "shipping policy",
      "returns policy",
      "free shipping",
      "30 day returns",
      "fragrance shipping",
      "order delivery",
      "return process",
      "shipping information"
    ].join(", "),
    openGraph: {
      title: "Shipping & Returns Policy | VAVE Fragrances",
      description: "Learn about VAVE Fragrances' shipping and returns policy. Free shipping on orders above ₹1000, 30-day return policy.",
      type: "website",
      url: `${siteConfig.url}/shipping-returns`,
      images: [
        {
          url: `${siteConfig.url}/og-shipping-returns.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Shipping & Returns",
        },
      ],
    },
  }),

  privacy: () => ({
    title: "Privacy Policy | VAVE Fragrances",
    description: "Read VAVE Fragrances' privacy policy to understand how we collect, use, and protect your personal information when you shop with us.",
    keywords: [
      "privacy policy",
      "data protection",
      "personal information",
      "privacy rights",
      "data security",
      "customer privacy"
    ].join(", "),
    openGraph: {
      title: "Privacy Policy | VAVE Fragrances",
      description: "Read VAVE Fragrances' privacy policy to understand how we collect, use, and protect your personal information.",
      type: "website",
      url: `${siteConfig.url}/privacy`,
      images: [
        {
          url: `${siteConfig.url}/og-privacy.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Privacy Policy",
        },
      ],
    },
  }),

  terms: () => ({
    title: "Terms of Service | VAVE Fragrances",
    description: "Read VAVE Fragrances' terms of service to understand the conditions for using our website and purchasing our fragrances.",
    keywords: [
      "terms of service",
      "terms and conditions",
      "website terms",
      "purchase terms",
      "user agreement",
      "service terms"
    ].join(", "),
    openGraph: {
      title: "Terms of Service | VAVE Fragrances",
      description: "Read VAVE Fragrances' terms of service to understand the conditions for using our website and purchasing our fragrances.",
      type: "website",
      url: `${siteConfig.url}/terms`,
      images: [
        {
          url: `${siteConfig.url}/og-terms.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Terms of Service",
        },
      ],
    },
  }),

  checkout: () => ({
    title: "Checkout - Complete Your Fragrance Order | VAVE Fragrances",
    description: "Complete your fragrance purchase securely with VAVE Fragrances. Secure payment processing, multiple payment options, and fast shipping.",
    keywords: [
      "checkout",
      "secure payment",
      "fragrance purchase",
      "order completion",
      "payment options",
      "secure checkout"
    ].join(", "),
    openGraph: {
      title: "Checkout - Complete Your Fragrance Order | VAVE Fragrances",
      description: "Complete your fragrance purchase securely with VAVE Fragrances. Secure payment processing and fast shipping.",
      type: "website",
      url: `${siteConfig.url}/checkout`,
      images: [
        {
          url: `${siteConfig.url}/og-checkout.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Checkout",
        },
      ],
    },
  }),

  wishlist: () => ({
    title: "My Wishlist - Saved Fragrances | VAVE Fragrances",
    description: "View your saved fragrances in your VAVE wishlist. Keep track of your favorite scents and easily add them to your cart when ready to purchase.",
    keywords: [
      "wishlist",
      "saved fragrances",
      "favorite perfumes",
      "saved items",
      "fragrance wishlist",
      "perfume wishlist"
    ].join(", "),
    openGraph: {
      title: "My Wishlist - Saved Fragrances | VAVE Fragrances",
      description: "View your saved fragrances in your VAVE wishlist. Keep track of your favorite scents.",
      type: "website",
      url: `${siteConfig.url}/wishlist`,
      images: [
        {
          url: `${siteConfig.url}/og-wishlist.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Wishlist",
        },
      ],
    },
  }),

  myOrders: () => ({
    title: "My Orders - Order History & Tracking | VAVE Fragrances",
    description: "View your order history and track your VAVE fragrance orders. Get updates on shipping status and delivery information.",
    keywords: [
      "my orders",
      "order history",
      "order tracking",
      "shipping status",
      "delivery tracking",
      "order management"
    ].join(", "),
    openGraph: {
      title: "My Orders - Order History & Tracking | VAVE Fragrances",
      description: "View your order history and track your VAVE fragrance orders. Get updates on shipping status.",
      type: "website",
      url: `${siteConfig.url}/my-orders`,
      images: [
        {
          url: `${siteConfig.url}/og-my-orders.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances My Orders",
        },
      ],
    },
  }),

  trackOrder: () => ({
    title: "Track Your Order | VAVE Fragrances",
    description: "Track your VAVE fragrance order with real-time shipping updates. Enter your order number to get the latest delivery status.",
    keywords: [
      "track order",
      "order tracking",
      "shipping tracking",
      "delivery status",
      "order status",
      "package tracking"
    ].join(", "),
    openGraph: {
      title: "Track Your Order | VAVE Fragrances",
      description: "Track your VAVE fragrance order with real-time shipping updates and delivery status.",
      type: "website",
      url: `${siteConfig.url}/track-order`,
      images: [
        {
          url: `${siteConfig.url}/og-track-order.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Order Tracking",
        },
      ],
    },
  }),

  business: () => ({
    title: "Business & Wholesale - VAVE Fragrances for Retailers",
    description: "Partner with VAVE Fragrances for wholesale and business opportunities. Premium fragrances for retailers, hotels, and businesses. Contact us for wholesale pricing.",
    keywords: [
      "wholesale fragrances",
      "business partnership",
      "retailer partnership",
      "bulk fragrances",
      "hotel fragrances",
      "business fragrances",
      "wholesale pricing",
      "retail partnership"
    ].join(", "),
    openGraph: {
      title: "Business & Wholesale - VAVE Fragrances for Retailers",
      description: "Partner with VAVE Fragrances for wholesale and business opportunities. Premium fragrances for retailers and businesses.",
      type: "website",
      url: `${siteConfig.url}/business`,
      images: [
        {
          url: `${siteConfig.url}/og-business.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Business Partnership",
        },
      ],
    },
  }),

  influencerCollaboration: () => ({
    title: "Influencer Collaboration - Partner with VAVE Fragrances",
    description: "Join VAVE Fragrances' influencer program. Collaborate with us to showcase our premium fragrances and reach fragrance enthusiasts worldwide.",
    keywords: [
      "influencer collaboration",
      "fragrance influencer",
      "perfume collaboration",
      "brand partnership",
      "influencer program",
      "fragrance ambassador",
      "social media collaboration"
    ].join(", "),
    openGraph: {
      title: "Influencer Collaboration - Partner with VAVE Fragrances",
      description: "Join VAVE Fragrances' influencer program. Collaborate with us to showcase our premium fragrances.",
      type: "website",
      url: `${siteConfig.url}/influencer-collaboration`,
      images: [
        {
          url: `${siteConfig.url}/og-influencer.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Influencer Collaboration",
        },
      ],
    },
  }),

  craftsmanship: () => ({
    title: "Craftsmanship - The Art of VAVE Fragrance Creation",
    description: "Discover the craftsmanship behind VAVE fragrances. Learn about our ingredient selection, formulation process, and quality control standards for premium perfumes.",
    keywords: [
      "fragrance craftsmanship",
      "perfume creation",
      "ingredient selection",
      "formulation process",
      "quality control",
      "fragrance art",
      "perfume making",
      "craftsmanship"
    ].join(", "),
    openGraph: {
      title: "Craftsmanship - The Art of VAVE Fragrance Creation",
      description: "Discover the craftsmanship behind VAVE fragrances. Learn about our ingredient selection and formulation process.",
      type: "website",
      url: `${siteConfig.url}/craftsmanship`,
      images: [
        {
          url: `${siteConfig.url}/og-craftsmanship.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Craftsmanship",
        },
      ],
    },
  }),

  sustainability: () => ({
    title: "Sustainability - VAVE Fragrances' Environmental Commitment",
    description: "Learn about VAVE Fragrances' commitment to sustainability, ethical sourcing, and environmental responsibility in fragrance production.",
    keywords: [
      "sustainable fragrances",
      "environmental responsibility",
      "ethical sourcing",
      "eco-friendly perfume",
      "sustainability commitment",
      "green fragrance",
      "environmental impact"
    ].join(", "),
    openGraph: {
      title: "Sustainability - VAVE Fragrances' Environmental Commitment",
      description: "Learn about VAVE Fragrances' commitment to sustainability, ethical sourcing, and environmental responsibility.",
      type: "website",
      url: `${siteConfig.url}/sustainability`,
      images: [
        {
          url: `${siteConfig.url}/og-sustainability.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Sustainability",
        },
      ],
    },
  }),

  findStore: () => ({
    title: "Find a Store - VAVE Fragrances Retail Locations",
    description: "Find VAVE Fragrances retail locations near you. Discover where you can experience our premium fragrances in person and get expert fragrance advice.",
    keywords: [
      "find store",
      "retail locations",
      "fragrance stores",
      "perfume stores",
      "store locator",
      "retail partners",
      "physical stores"
    ].join(", "),
    openGraph: {
      title: "Find a Store - VAVE Fragrances Retail Locations",
      description: "Find VAVE Fragrances retail locations near you. Discover where you can experience our premium fragrances in person.",
      type: "website",
      url: `${siteConfig.url}/find-store`,
      images: [
        {
          url: `${siteConfig.url}/og-find-store.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Store Locator",
        },
      ],
    },
  }),

  gallery: () => ({
    title: "Gallery - VAVE Fragrances Visual Collection",
    description: "Explore VAVE Fragrances' visual gallery showcasing our premium perfume collection, lifestyle imagery, and fragrance inspiration.",
    keywords: [
      "fragrance gallery",
      "perfume images",
      "visual collection",
      "fragrance photography",
      "lifestyle images",
      "perfume gallery"
    ].join(", "),
    openGraph: {
      title: "Gallery - VAVE Fragrances Visual Collection",
      description: "Explore VAVE Fragrances' visual gallery showcasing our premium perfume collection and lifestyle imagery.",
      type: "website",
      url: `${siteConfig.url}/gallery`,
      images: [
        {
          url: `${siteConfig.url}/og-gallery.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Gallery",
        },
      ],
    },
  }),

  newArrivals: () => ({
    title: "New Arrivals - Latest VAVE Fragrances",
    description: "Discover the latest additions to VAVE Fragrances' collection. Stay updated with new releases and limited edition fragrances.",
    keywords: [
      "new arrivals",
      "latest fragrances",
      "new perfumes",
      "recent releases",
      "new products",
      "latest collection",
      "new releases"
    ].join(", "),
    openGraph: {
      title: "New Arrivals - Latest VAVE Fragrances",
      description: "Discover the latest additions to VAVE Fragrances' collection. Stay updated with new releases.",
      type: "website",
      url: `${siteConfig.url}/new-arrivals`,
      images: [
        {
          url: `${siteConfig.url}/og-new-arrivals.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances New Arrivals",
        },
      ],
    },
  }),

  help: () => ({
    title: "Help Center - VAVE Fragrances Support",
    description: "Get help with VAVE Fragrances. Find answers to common questions, contact support, and get assistance with your fragrance needs.",
    keywords: [
      "help center",
      "customer support",
      "fragrance help",
      "perfume support",
      "assistance",
      "support center",
      "help desk"
    ].join(", "),
    openGraph: {
      title: "Help Center - VAVE Fragrances Support",
      description: "Get help with VAVE Fragrances. Find answers to common questions and contact support.",
      type: "website",
      url: `${siteConfig.url}/help`,
      images: [
        {
          url: `${siteConfig.url}/og-help.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Help Center",
        },
      ],
    },
  }),

  profile: () => ({
    title: "My Profile - VAVE Fragrances Account",
    description: "Manage your VAVE Fragrances account profile, update personal information, and customize your fragrance preferences.",
    keywords: [
      "my profile",
      "account profile",
      "user profile",
      "account settings",
      "personal information",
      "profile management"
    ].join(", "),
    openGraph: {
      title: "My Profile - VAVE Fragrances Account",
      description: "Manage your VAVE Fragrances account profile and update personal information.",
      type: "website",
      url: `${siteConfig.url}/profile`,
      images: [
        {
          url: `${siteConfig.url}/og-profile.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Profile",
        },
      ],
    },
  }),

  settings: () => ({
    title: "Account Settings - VAVE Fragrances",
    description: "Manage your VAVE Fragrances account settings, preferences, and notification preferences.",
    keywords: [
      "account settings",
      "user settings",
      "preferences",
      "notification settings",
      "account management",
      "settings"
    ].join(", "),
    openGraph: {
      title: "Account Settings - VAVE Fragrances",
      description: "Manage your VAVE Fragrances account settings, preferences, and notification preferences.",
      type: "website",
      url: `${siteConfig.url}/settings`,
      images: [
        {
          url: `${siteConfig.url}/og-settings.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Settings",
        },
      ],
    },
  }),

  account: () => ({
    title: "My Account - VAVE Fragrances Dashboard",
    description: "Access your VAVE Fragrances account dashboard to manage orders, wishlist, profile, and account settings.",
    keywords: [
      "my account",
      "account dashboard",
      "user account",
      "account management",
      "dashboard",
      "account overview"
    ].join(", "),
    openGraph: {
      title: "My Account - VAVE Fragrances Dashboard",
      description: "Access your VAVE Fragrances account dashboard to manage orders, wishlist, and account settings.",
      type: "website",
      url: `${siteConfig.url}/account`,
      images: [
        {
          url: `${siteConfig.url}/og-account.jpg`,
          width: 1200,
          height: 630,
          alt: "VAVE Fragrances Account Dashboard",
        },
      ],
    },
  }),
}

// Default metadata for the site
export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: siteConfig.authors,
  creator: siteConfig.creator,
  publisher: siteConfig.publisher,
  formatDetection: siteConfig.formatDetection,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@vavefragrances",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
}
