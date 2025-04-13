"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/contexts/cart-context"
import Link from "next/link"
import type React from "react" // Added import for React

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  category: string
  rating: number
  reviews: number
}

export function ProductCard({ id, name, price, image, category, rating, reviews }: ProductCardProps) {
  const { addToCart } = useCart()

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    await addToCart(id)
  }

  return (
    <Link href={`/products/${id}`} className="block group">
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardContent className="p-4">
          <div className="relative aspect-square overflow-hidden rounded-lg mb-3">
            <img
              src={image || "/placeholder.svg"}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <h3 className="font-semibold text-sm md:text-base line-clamp-2">{name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-bold">${price}</span>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex text-yellow-400">
              {"★".repeat(rating)}
              {"☆".repeat(5 - rating)}
            </div>
            <span className="text-sm text-muted-foreground">({reviews})</span>
          </div>
          <Button className="mt-4 w-full" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Link>
  )
}
