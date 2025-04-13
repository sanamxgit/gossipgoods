"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    name: "Electronics",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 1234,
    color: "bg-blue-100",
  },
  {
    name: "Fashion",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 5678,
    color: "bg-pink-100",
  },
  {
    name: "Home & Garden",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 910,
    color: "bg-green-100",
  },
  {
    name: "Sports",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 432,
    color: "bg-orange-100",
  },
  {
    name: "Beauty",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 765,
    color: "bg-purple-100",
  },
  {
    name: "Automotive",
    image: "/placeholder.svg?height=200&width=200",
    itemCount: 543,
    color: "bg-yellow-100",
  },
]

export function CategoriesSection() {
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
    <section className="py-12 bg-white">
      <div className="container">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-4 md:gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div key={category.name} className="flex-none w-[150px] md:w-[200px] snap-start">
                <div className="group cursor-pointer text-center">
                  <div className={`relative aspect-square overflow-hidden rounded-full mb-4 ${category.color}`}>
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-semibold text-base md:text-lg">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.itemCount.toLocaleString()} items</p>
                </div>
              </div>
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
