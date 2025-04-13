import type React from "react"
import { SiteHeader } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow">{children}</main>
      <SiteFooter />
    </div>
  )
}
