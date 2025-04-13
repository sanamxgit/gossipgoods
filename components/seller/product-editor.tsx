"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ColorOption } from "@/components/seller/color-option"
import { ImageUploader } from "@/components/seller/image-uploader"
import { ModelViewer } from "@/components/seller/model-viewer"

interface ProductEditorProps {
  data: {
    name: string
    description: string
    price: string
    category: string
    woodOptions: Array<{ name: string; value: string; className: string }>
    upholsteryOptions: Array<{ name: string; value: string; className: string }>
    images: string[]
    glbUrl: string
    usdzUrl: string
  }
  onUpdate: (data: ProductEditorProps["data"]) => void
}

export function ProductEditor({ data, onUpdate }: ProductEditorProps) {
  const [formData, setFormData] = useState(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleColorOptionChange = (
    type: "wood" | "upholstery",
    options: Array<{ name: string; value: string; className: string }>,
  ) => {
    setFormData((prev) => ({ ...prev, [`${type}Options`]: options }))
  }

  const handleImageChange = (images: string[]) => {
    setFormData((prev) => ({ ...prev, images }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label htmlFor="name">Product Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Product Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Input id="category" name="category" value={formData.category} onChange={handleChange} required />
      </div>
      <div>
        <Label>Wood Options</Label>
        <ColorOption options={formData.woodOptions} onChange={(options) => handleColorOptionChange("wood", options)} />
      </div>
      <div>
        <Label>Upholstery Options</Label>
        <ColorOption
          options={formData.upholsteryOptions}
          onChange={(options) => handleColorOptionChange("upholstery", options)}
        />
      </div>
      <div>
        <Label>Product Images</Label>
        <ImageUploader images={formData.images} onChange={handleImageChange} />
      </div>
      <div>
        <Label htmlFor="glbUrl">GLB Model URL</Label>
        <Input id="glbUrl" name="glbUrl" value={formData.glbUrl} onChange={handleChange} />
      </div>
      <div>
        <Label htmlFor="usdzUrl">USDZ Model URL</Label>
        <Input id="usdzUrl" name="usdzUrl" value={formData.usdzUrl} onChange={handleChange} />
      </div>
      <div>
        <Label>3D Model Preview</Label>
        <ModelViewer glbUrl={formData.glbUrl} usdzUrl={formData.usdzUrl} />
      </div>
      <Button type="submit">Update Product</Button>
    </form>
  )
}
