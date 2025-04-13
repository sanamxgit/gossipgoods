"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface ImageUploaderProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleAddImage = () => {
    if (newImageUrl) {
      onChange([...images, newImageUrl])
      setNewImageUrl("")
    }
  }

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {images.map((image, index) => (
        <div key={index} className="flex items-center space-x-2">
          <img
            src={image || "/placeholder.svg"}
            alt={`Product image ${index + 1}`}
            className="w-16 h-16 object-cover rounded"
          />
          <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveImage(index)}>
            Remove
          </Button>
        </div>
      ))}
      <div className="flex items-center space-x-2">
        <Input
          type="url"
          placeholder="Enter image URL"
          value={newImageUrl}
          onChange={(e) => setNewImageUrl(e.target.value)}
        />
        <Button type="button" onClick={handleAddImage}>
          Add Image
        </Button>
      </div>
    </div>
  )
}
