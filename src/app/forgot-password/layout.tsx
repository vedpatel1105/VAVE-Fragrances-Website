import type { Metadata } from "next"
import { metadataGenerators } from "@/src/lib/metadata"

export const metadata: Metadata = {
  title: "Forgot Password - Reset Your Account | VAVE Fragrances",
  description: "Reset your VAVE Fragrances account password. Enter your email to receive password reset instructions.",
  keywords: "forgot password, reset password, account recovery, VAVE fragrances login, password reset",
  openGraph: {
    title: "Forgot Password - Reset Your Account | VAVE Fragrances",
    description: "Reset your VAVE Fragrances account password. Enter your email to receive password reset instructions.",
    type: "website",
    url: `${metadataGenerators.home().openGraph?.url}/forgot-password`,
  },
}

export default function ForgotPasswordLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}