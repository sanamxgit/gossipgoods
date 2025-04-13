"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"

interface Product {
  id: string
  name: string
  price: number
  image: string
  isEco?: boolean
  has3D?: boolean
}

interface ProductSectionProps {
  title: string
  products: Product[]
}

function ProductSection({ title, products }: ProductSectionProps) {
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
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link href="#" className="text-sm text-gray-600 hover:text-gray-900">
          View More
        </Link>
      </div>
      <div className="relative">
        <div
          ref={scrollContainerRef}
          className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {products.map((product) => (
            <Card key={product.id} className="flex-none w-[250px] snap-start">
              <div className="relative aspect-square">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2 flex gap-1">
                  {product.isEco && <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">Eco</span>}
                  {product.has3D && <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">3D</span>}
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <p className="text-gray-900">NRP{product.price.toLocaleString()}.00</p>
              </div>
            </Card>
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
  )
}

const moreChairs = [
  {
    id: "1",
    name: "Curious Chair",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "2",
    name: "Time Flies Chair",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
    has3D: true,
  },
  {
    id: "3",
    name: "Conversation Piece",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
    has3D: true,
  },
  {
    id: "4",
    name: "The Tree",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
    isEco: true,
  },
  {
    id: "5",
    name: "Product name",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
  },
]

const styleWith = [
  {
    id: "6",
    name: "Asteria floor lamp",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "7",
    name: "Carmina",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "8",
    name: "Chimes Cluster",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
  },
  {
    id: "9",
    name: "Audacious Side Table",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
    isEco: true,
  },
  {
    id: "10",
    name: "Conversation Piece",
    price: 9999,
    image: "/placeholder.svg?height=300&width=300",
    has3D: true,
  },
]

export function ProductRecommendations() {
  return (
    <div className="space-y-16 py-16">
      <div className="container">
        <ProductSection title="More chair" products={moreChairs} />
      </div>
      <div className="container">
        <ProductSection title="Style it With" products={styleWith} />
      </div>
    </div>
  )
}
