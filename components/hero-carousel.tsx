"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Slide {
  type: "video" | "image"
  src: string
  products?: {
    name: string
    type: string
    price: number
    rating: number
  }[]
}

const slides: Slide[] = [
  {
    type: "video",
    src: "/video-placeholder.mp4",
    products: [
      { name: "Adalon", type: "Floor lamp", price: 40.99, rating: 4.5 },
      { name: "Torrondo", type: "Floor lamp", price: 80.99, rating: 5 },
      { name: "YHTlach", type: "Floor lamp", price: 99.99, rating: 4 },
    ],
  },
  {
    type: "image",
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-KzDBUBRpx3aJLmXttlNPPuBzqyC4Fw.png",
  },
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      <div className="absolute inset-0">
        {slides[currentSlide].type === "video" ? (
          <video autoPlay muted loop className="h-full w-full object-cover">
            <source src={slides[currentSlide].src} type="video/mp4" />
          </video>
        ) : (
          <img
            src={slides[currentSlide].src || "/placeholder.svg"}
            alt="Slide"
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {slides[currentSlide].products && (
        <div className="container relative h-full">
          <div className="absolute right-8 top-1/2 -translate-y-1/2 w-80">
            <Card className="bg-gray-900/80 p-6 text-white">
              <h3 className="text-2xl font-bold mb-4">Lamps</h3>
              <p className="text-sm mb-4">3 recommendations for this room</p>
              <div className="space-y-4">
                {slides[currentSlide].products.map((product) => (
                  <div key={product.name} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-300">{product.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.price}</p>
                      <div className="flex text-yellow-400">{"★".repeat(Math.floor(product.rating))}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex gap-2">
                <Button className="w-full">Buy Now</Button>
                <Button variant="outline" className="w-full">
                  Save
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="container relative h-full">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
          onClick={nextSlide}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
