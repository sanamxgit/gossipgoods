"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface Brand {
  id: string
  name: string
}

export function BrandSelection() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [newBrandName, setNewBrandName] = useState("")
  const router = useRouter()

  useEffect(() => {
    fetchBrands()
  }, [])

  async function fetchBrands() {
    const { data, error } = await supabase.from("brands").select("*")

    if (error) {
      console.error("Error fetching brands:", error)
    } else {
      setBrands(data || [])
    }
  }

  async function handleBrandSelection(brandId: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase.from("seller_brands").upsert({ seller_id: user.id, brand_id: brandId })

      if (error) {
        console.error("Error selecting brand:", error)
      } else {
        router.push(`/seller/dashboard/${brandId}`)
      }
    }
  }

  async function handleCreateBrand() {
    if (newBrandName.trim()) {
      const { data, error } = await supabase.from("brands").insert({ name: newBrandName.trim() }).select()

      if (error) {
        console.error("Error creating brand:", error)
      } else if (data) {
        setBrands([...brands, data[0]])
        setNewBrandName("")
      }
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Select or Create a Brand</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {brands.map((brand) => (
            <Button key={brand.id} onClick={() => handleBrandSelection(brand.id)} className="w-full">
              {brand.name}
            </Button>
          ))}
          <div className="flex items-center space-x-2">
            <Label htmlFor="new-brand" className="sr-only">
              New Brand Name
            </Label>
            <Input
              id="new-brand"
              placeholder="New Brand Name"
              value={newBrandName}
              onChange={(e) => setNewBrandName(e.target.value)}
            />
            <Button onClick={handleCreateBrand}>Create</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
