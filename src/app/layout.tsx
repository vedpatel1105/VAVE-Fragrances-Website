import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { UserProvider } from "@/src/contexts/UserContext"
import { Toaster } from "@/components/ui/toaster"

const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-montserrat" })

export const metadata: Metadata = {
  title: "VAVE - Premium Fragrances",
  description: "Discover our collection of luxurious and captivating perfumes.",
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
      </head>
      <body className={`${playfair.variable} ${montserrat.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <UserProvider>
            {children}
          </UserProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}
