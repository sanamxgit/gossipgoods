import type React from "react"
import { SideNav } from "@/components/seller/side-nav"

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SideNav />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
