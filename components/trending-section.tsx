"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const categories = [
  {
    title: "Furniture",
    subtitle: "in your style",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-PF7XK94iXWbuqZfii2IKHO8BKdCes5.png",
    href: "/category/furniture",
  },
  {
    title: "Lamp",
    subtitle: "in your environment",
    image: "/placeholder.svg?height=400&width=300",
    href: "/category/lamp",
  },
  {
    title: "Your skincare",
    subtitle: "experts",
    image: "/placeholder.svg?height=400&width=300",
    href: "/category/skincare",
  },
  {
    title: "Humidifier",
    subtitle: "relief your skin",
    image: "/placeholder.svg?height=400&width=300",
    href: "/category/humidifier",
  },
  {
    title: "A new Era",
    subtitle: "of TVs",
    image: "/placeholder.svg?height=400&width=300",
    href: "/category/tv",
  },
  {
    title: "See, hear",
    subtitle: "and feel",
    image: "/placeholder.svg?height=400&width=300",
    href: "/category/entertainment",
  },
]

export function TrendingSection() {
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
    <section className="py-12">
      <div className="container">
        <h2 className="text-4xl font-bold mb-8">Trending now.</h2>
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-4 snap-x snap-mandatory scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <div key={category.title} className="flex-none w-[300px] snap-start">
                <div className="group relative h-[400px] overflow-hidden rounded-lg">
                  <img
                    src={category.image || "/placeholder.svg"}
                    alt={category.title}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-transparent p-6">
                    <h3 className="text-3xl font-bold text-white">{category.title}</h3>
                    <p className="text-xl text-white/90">{category.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
            onClick={() => scroll("left")}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg"
            onClick={() => scroll("right")}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </section>
  )
}
