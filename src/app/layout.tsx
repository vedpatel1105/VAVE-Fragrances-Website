import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { AuthProvider } from "@/src/contexts/AuthProvider"
import { Toaster } from "@/components/ui/toaster"
import Script from "next/script"
import { defaultMetadata } from "@/src/lib/metadata"
import AnalyticsTracker from "@/src/components/AnalyticsTracker"

export const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
export const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata: Metadata = {
  ...defaultMetadata,
  title: "Home | VAVE - Premium Fragrances",
  description: "Discover our curated selection of luxurious and captivating perfumes. Explore bestsellers, new arrivals, and unique layering combinations.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
        <link rel="manifest" href="/favicon/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon/favicon.ico" />
        <Script async src="https://www.googletagmanager.com/gtag/js?id=G-KFF48VFPD2"></Script>
        <Script
          id="google-analytics"
          strategy="afterInteractive"
        >
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KFF48VFPD2');
          `}
        </Script>
        
        {/* Meta Pixel (Facebook) */}
        {process.env.NEXT_PUBLIC_META_PIXEL_ID && (
          <Script id="facebook-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${process.env.NEXT_PUBLIC_META_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}

      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider>
              <AnalyticsTracker />
              <PageTransition>
                {children}
              </PageTransition>
          </AuthProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

