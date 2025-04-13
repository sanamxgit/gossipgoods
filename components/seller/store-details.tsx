"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StoreDetailsProps {
  data: {
    name: string
    description: string
    logo: string
  }
  onUpdate: (data: StoreDetailsProps["data"]) => void
}

export function StoreDetails({ data, onUpdate }: StoreDetailsProps) {
  const [formData, setFormData] = useState(data)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onUpdate(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Store Name</Label>
        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Store Description</Label>
        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="logo">Logo URL</Label>
        <Input id="logo" name="logo" value={formData.logo} onChange={handleChange} />
      </div>
      <Button type="submit">Update Store Details</Button>
    </form>
  )
}
