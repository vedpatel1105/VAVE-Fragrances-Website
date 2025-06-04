import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export interface BreadcrumbProps extends React.ComponentPropsWithoutRef<"nav"> {
  separator?: React.ReactNode
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(({ className, separator, ...props }, ref) => {
  return (
    <nav
      ref={ref}
      aria-label="breadcrumb"
      className={cn("flex items-center text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
Breadcrumb.displayName = "Breadcrumb"

export interface BreadcrumbItemProps extends React.ComponentPropsWithoutRef<"li"> {}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(({ className, ...props }, ref) => {
  return <li ref={ref} className={cn("inline-flex items-center", className)} {...props} />
})
BreadcrumbItem.displayName = "BreadcrumbItem"

export interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  href: string
  isCurrentPage?: boolean
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
  ({ className, href, isCurrentPage, ...props }, ref) => {
    if (isCurrentPage) {
      return <span className={cn("font-medium text-foreground", className)} aria-current="page" {...props} />
    }

    return (
      <Link ref={ref} href={href} className={cn("hover:text-foreground transition-colors", className)} {...props} />
    )
  },
)
BreadcrumbLink.displayName = "BreadcrumbLink"

export { Breadcrumb, BreadcrumbItem, BreadcrumbLink }
