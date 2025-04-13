"use client"

import Link from "next/link"
import { Search, ShoppingCart, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { LoginDialog } from "@/components/auth/login-dialog"
import { SellerAuthDialog } from "@/components/auth/seller-auth-dialog"
import { useCart } from "@/contexts/cart-context"

export function SiteHeader() {
  const { cartCount } = useCart()

  return (
    <header className="w-full border-b">
      {/* Top Navigation */}
      <div className="w-full border-b bg-white">
        <div className="container flex h-10 items-center justify-end space-x-8">
          <SellerAuthDialog />
          <Link href="/support" className="text-sm hover:text-gray-600">
            Help & Support
          </Link>
          <Link href="/contact" className="text-sm hover:text-gray-600">
            Contact
          </Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="w-full bg-black text-white">
        <div className="container flex h-16 items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            <img src="logo.png" alt="gossipgoods"/>
          </Link>

          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input placeholder="Search..." className="w-full rounded-md border bg-white px-10 py-2 text-black" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <LoginDialog />
              <span className="text-gray-400">|</span>
              <Button variant="ghost" className="text-white">
                Sign Up
              </Button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white">
                  <Globe className="h-5 w-5" />
                  <span className="ml-2">EN</span>
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>EN</DropdownMenuItem>
                <DropdownMenuItem>NP</DropdownMenuItem>

              </DropdownMenuContent>
            </DropdownMenu>

            <Button variant="ghost" size="icon" className="text-white relative">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Category Navigation */}
      <div className="w-full bg-white">
        <div className="container flex h-12 items-center space-x-8">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:text-gray-600">
              All Categories
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Electronics</DropdownMenuItem>
              <DropdownMenuItem>Fashion</DropdownMenuItem>
              <DropdownMenuItem>Home & Garden</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="/super-deals" className="hover:text-gray-600">
            SuperDeals
          </Link>
          <Link href="/new" className="hover:text-gray-600">
            New
          </Link>
          <Link href="/3d-try-on" className="hover:text-gray-600">
            3D Try on
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:text-gray-600">
              More
              <ChevronDown className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Services</DropdownMenuItem>
              <DropdownMenuItem>Promotions</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
