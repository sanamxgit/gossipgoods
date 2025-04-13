import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { CartProvider } from "@/contexts/cart-context"
import type React from "react"
import Head from "next/head" // Import Head for adding meta tags

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GossipGoods - Your one-stop shop for all things trendy",
  description: "Your one-stop shop for all things trendy",
  icons: {
    icon: "/titleLogo.png",
  }
}


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <Head>
        <link rel="icon" href="/titleLogo.png" type="image/png" />
      </Head>
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
