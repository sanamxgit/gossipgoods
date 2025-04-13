"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Product {
  id: string
  name: string
  description: string
  price: number
}

export default function SellerDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [newProduct, setNewProduct] = useState({ name: "", description: "", price: "0" }) // Initialize price as a string to handle empty input
  const { brandId } = useParams()

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    const { data, error } = await supabase.from("products").select("*").eq("brand_id", brandId)

    if (error) {
      console.error("Error fetching products:", error)
    } else {
      setProducts(data || [])
    }
  }

  async function handleAddProduct(e: React.FormEvent) {
    e.preventDefault()
    const { data, error } = await supabase
      .from("products")
      .insert({
        ...newProduct,
        price: Number.parseFloat(newProduct.price),
        brand_id: brandId,
      })
      .select()

    if (error) {
      console.error("Error adding product:", error)
    } else if (data) {
      setProducts([...products, data[0]])
      setNewProduct({ name: "", description: "", price: "0" }) // Reset price to 0 after adding
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Add New Product</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="product-name">Product Name</Label>
                <Input
                  id="product-name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-description">Description</Label>
                <Textarea
                  id="product-description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="product-price">Price</Label>
                <Input
                  id="product-price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
              </div>
              <Button type="submit">Add Product</Button>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Your Products</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {products.map((product) => (
                <li key={product.id} className="flex justify-between items-center">
                  <span>{product.name}</span>
                  <span>${product.price.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
