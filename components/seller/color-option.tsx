"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ColorOptionProps {
  options: Array<{ name: string; value: string; className: string }>
  onChange: (options: Array<{ name: string; value: string; className: string }>) => void
}

export function ColorOption({ options, onChange }: ColorOptionProps) {
  const [newOption, setNewOption] = useState({ name: "", value: "", className: "" })

  const handleAddOption = () => {
    if (newOption.name && newOption.value && newOption.className) {
      onChange([...options, newOption])
      setNewOption({ name: "", value: "", className: "" })
    }
  }

  const handleRemoveOption = (index: number) => {
    onChange(options.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-2">
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div className={`w-6 h-6 rounded-full ${option.className}`} />
          <span>{option.name}</span>
          <Button type="button" variant="destructive" size="sm" onClick={() => handleRemoveOption(index)}>
            Remove
          </Button>
        </div>
      ))}
      <div className="flex items-end space-x-2">
        <div>
          <Label htmlFor="optionName">Name</Label>
          <Input
            id="optionName"
            value={newOption.name}
            onChange={(e) => setNewOption((prev) => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="optionValue">Value</Label>
          <Input
            id="optionValue"
            value={newOption.value}
            onChange={(e) => setNewOption((prev) => ({ ...prev, value: e.target.value }))}
          />
        </div>
        <div>
          <Label htmlFor="optionClass">Tailwind Class</Label>
          <Input
            id="optionClass"
            value={newOption.className}
            onChange={(e) => setNewOption((prev) => ({ ...prev, className: e.target.value }))}
          />
        </div>
        <Button type="button" onClick={handleAddOption}>
          Add Option
        </Button>
      </div>
    </div>
  )
}
