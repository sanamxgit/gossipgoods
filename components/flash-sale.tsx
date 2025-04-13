"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const products = [
  {
    id: 1,
    name: "Wireless Earbuds Pro",
    price: 199.99,
    discountPrice: 149.99,
    image: "/placeholder.svg?height=200&width=200",
    discount: 25,
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Smart Watch Series 5",
    price: 299.99,
    discountPrice: 249.99,
    image: "/placeholder.svg?height=200&width=200",
    discount: 17,
    rating: 4.8,
    reviews: 256,
  },
  {
    id: 3,
    name: "Noise Cancelling Headphones",
    price: 349.99,
    discountPrice: 279.99,
    image: "/placeholder.svg?height=200&width=200",
    discount: 20,
    rating: 4.7,
    reviews: 189,
  },
  {
    id: 4,
    name: "Portable Speaker",
    price: 129.99,
    discountPrice: 99.99,
    image: "/placeholder.svg?height=200&width=200",
    discount: 23,
    rating: 4.6,
    reviews: 145,
  },
  // Add more products as needed
]

export function FlashSale() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400
      scrollContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">Flash Sale</h2>
            <p className="text-muted-foreground mt-1">Don't miss out on these amazing deals!</p>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm">
              Ends in: <span className="font-mono font-bold">23:59:59</span>
            </div>
          </div>
        </div>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.id}`}
                className="flex-none w-[280px] md:w-[300px] snap-start"
              >
                <Card className="h-full transition-shadow hover:shadow-lg">
                  <div className="relative p-4">
                    <Badge className="absolute top-2 right-2 bg-red-500">-{product.discount}%</Badge>
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-[200px] object-cover rounded-md mb-4"
                    />
                    <h3 className="font-semibold truncate">{product.name}</h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-xl font-bold">${product.discountPrice}</span>
                      <span className="text-sm text-muted-foreground line-through">${product.price}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex text-yellow-400">
                        {"★".repeat(Math.floor(product.rating))}
                        {"☆".repeat(5 - Math.floor(product.rating))}
                      </div>
                      <span className="text-sm text-muted-foreground">({product.reviews})</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg hidden md:flex"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg hidden md:flex"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
