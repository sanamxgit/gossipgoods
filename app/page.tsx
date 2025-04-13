import { SiteHeader } from "@/components/navbar"
import { HeroCarousel } from "@/components/hero-carousel"
import { TrendingSection } from "@/components/trending-section"
import { FlashSale } from "@/components/flash-sale"
import { CategoriesSection } from "@/components/categories-section"
import { ProductRecommendations } from "@/components/product-recommendations"
import { SiteFooter } from "@/components/site-footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow">
        <HeroCarousel />
        <TrendingSection />
        <FlashSale />
        <CategoriesSection />
        <ProductRecommendations />
      </main>
      <SiteFooter />
    </div>
  )
}
