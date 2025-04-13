"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Product3DViewer } from "@/components/product-3d-viewer"

interface ColorOption {
  name: string
  value: string
  className: string
}

const woodOptions: ColorOption[] = [
  { name: "Natural Oak", value: "oak", className: "bg-[#D4B59D]" },
  { name: "Black", value: "black", className: "bg-black" },
  { name: "Dark Walnut", value: "walnut", className: "bg-[#4A3B2B]" },
]

const upholsteryOptions: ColorOption[] = [
  { name: "Sugar Brown", value: "brown", className: "bg-[#8B4513]" },
  { name: "Navy Blue", value: "navy", className: "bg-[#000080]" },
  { name: "Deep Red", value: "red", className: "bg-[#8B0000]" },
  { name: "Beige", value: "beige", className: "bg-[#F5F5DC]" },
  { name: "Dark Brown", value: "darkbrown", className: "bg-[#654321]" },
  { name: "Gray", value: "gray", className: "bg-gray-400" },
  { name: "Black", value: "black", className: "bg-black" },
]

export default function ProductDetails() {
  const [selectedWood, setSelectedWood] = useState(woodOptions[0])
  const [selectedUpholstery, setSelectedUpholstery] = useState(upholsteryOptions[0])
  const [currentIndex, setCurrentIndex] = useState(0)
  const mainScrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const images = [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-InUOcfRiPkxQQtfXOey0ez8E3KEYHF.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3i1yJGGzf7ANMsW4uUf5jgBLHf8Ij8.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-InUOcfRiPkxQQtfXOey0ez8E3KEYHF.png",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-3i1yJGGzf7ANMsW4uUf5jgBLHf8Ij8.png",
  ]

  const glbUrl = "https://raw.githubusercontent.com/sanamxgit/models/main/untitled.glb"
  const usdzUrl = "https://raw.githubusercontent.com/sanamxgit/models/main/untitled.usdz"

  const scroll = (direction: "left" | "right") => {
    if (mainScrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -1 : 1
      const newIndex = (currentIndex + scrollAmount + images.length + 1) % (images.length + 1)
      setCurrentIndex(newIndex)
      mainScrollContainerRef.current.scrollTo({
        left: newIndex * mainScrollContainerRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (mainScrollContainerRef.current) {
        const scrollPosition = mainScrollContainerRef.current.scrollLeft
        const viewportWidth = mainScrollContainerRef.current.offsetWidth
        const newIndex = Math.round(scrollPosition / viewportWidth)
        setCurrentIndex(newIndex)
      }
    }

    mainScrollContainerRef.current?.addEventListener("scroll", handleScroll)
    return () => mainScrollContainerRef.current?.removeEventListener("scroll", handleScroll)
  }, [])

  const handleBuyNow = () => {
    // In a real app, you would get the actual product ID from the URL or props
    const productId = "1" // This is a placeholder, you should use the actual product ID
    router.push(`/checkout?productId=${productId}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-8">
            {/* Main Image Gallery */}
            <div className="relative">
              <div
                ref={mainScrollContainerRef}
                className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              >
                {images.map((src, i) => (
                  <div key={i} className="flex-none w-full snap-center">
                    <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={src || "/placeholder.svg"}
                        alt={`Product view ${i + 1}`}
                        fill
                        className="object-cover"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex-none w-full snap-center">
                  <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
                    <Product3DViewer glbUrl={glbUrl} usdzUrl={usdzUrl} />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg z-10"
                onClick={() => scroll("left")}
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow-lg z-10"
                onClick={() => scroll("right")}
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-6 gap-4">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => {
                    if (mainScrollContainerRef.current) {
                      mainScrollContainerRef.current.scrollTo({
                        left: i * mainScrollContainerRef.current.offsetWidth,
                        behavior: "smooth",
                      })
                    }
                    setCurrentIndex(i)
                  }}
                  className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden ${
                    currentIndex === i ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <Image
                    src={src || "/placeholder.svg"}
                    alt={`Thumbnail ${i + 1}`}
                    fill
                    className="object-cover hover:opacity-80 transition-opacity"
                  />
                </button>
              ))}
              <button
                onClick={() => {
                  if (mainScrollContainerRef.current) {
                    mainScrollContainerRef.current.scrollTo({
                      left: images.length * mainScrollContainerRef.current.offsetWidth,
                      behavior: "smooth",
                    })
                  }
                  setCurrentIndex(images.length)
                }}
                className={`aspect-square relative bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center ${
                  currentIndex === images.length ? "ring-2 ring-primary" : ""
                }`}
              >
                <div className="text-lg font-bold">3D</div>
              </button>
            </div>
          </div>

          {/* Product Details */}
          <div>
            <div className="text-sm text-gray-500 mb-2">shop</div>
            <h1 className="text-4xl font-bold mb-2">The Reader</h1>
            <div className="text-gray-600 mb-4">Wing Chair</div>

            <div className="flex items-baseline gap-4 mb-6">
              <span className="text-2xl font-bold text-red-600">Rs. 14,000</span>
              <span className="text-gray-500 line-through">Rs. 19,000</span>
            </div>

            <p className="text-gray-600 mb-8">
              The Reader wing chair has been designed to let your body sink into and relax. The chair's unique curved
              shell is inspired by traditional Danish...
            </p>

            <div className="space-y-8">
              {/* Wood Options */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  WOOD
                  <span className="text-gray-500">• {selectedWood.name}</span>
                </label>
                <div className="flex gap-2">
                  {woodOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedWood(option)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedWood.value === option.value
                          ? "border-primary ring-2 ring-black/10"
                          : "border-transparent"
                      }`}
                    >
                      <span className={`block w-full h-full rounded-full ${option.className}`} />
                      <span className="sr-only">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Upholstery Options */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium mb-3">
                  UPHOLSTERY
                  <span className="text-gray-500">• {selectedUpholstery.name} - Horizon Textiles</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {upholsteryOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedUpholstery(option)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        selectedUpholstery.value === option.value
                          ? "border-primary ring-2 ring-black/10"
                          : "border-transparent"
                      }`}
                    >
                      <span className={`block w-full h-full rounded-full ${option.className}`} />
                      <span className="sr-only">{option.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Button className="w-full h-12 text-base" variant="default">
                  Add To Cart
                </Button>
                <Button className="w-full h-12 text-base" variant="secondary" onClick={handleBuyNow}>
                  Buy Now
                </Button>
              </div>

              {/* Shipping Notice */}
              <p className="text-sm text-gray-500 flex items-center gap-2">
                <span className="inline-block">🚚</span>
                For in-valley orders, Free Shipping!!!
              </p>

              {/* Additional Info Links */}
              <div className="flex gap-6 text-sm">
                <button className="text-gray-600 hover:text-gray-900 underline">Read more</button>
                <button className="text-gray-600 hover:text-gray-900 underline">Technical Details</button>
                <button className="text-gray-600 hover:text-gray-900 underline">More images</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
