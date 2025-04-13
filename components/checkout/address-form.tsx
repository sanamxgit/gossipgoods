"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AddressFormProps {
  initialAddress: {
    fullName: string
    phoneNumber: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  onSubmit: (address: AddressFormProps["initialAddress"]) => void
}

export function AddressForm({ initialAddress, onSubmit }: AddressFormProps) {
  const [address, setAddress] = useState(initialAddress)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!address.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }

    if (!address.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required"
    } else if (!/^\d{10}$/.test(address.phoneNumber)) {
      newErrors.phoneNumber = "Please enter a valid 10-digit phone number"
    }

    if (!address.address.trim()) {
      newErrors.address = "Address is required"
    }

    if (!address.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required"
    }

    if (!address.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(address)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping Address</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                name="fullName"
                value={address.fullName}
                onChange={handleChange}
                className={errors.fullName ? "border-red-500" : ""}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={address.phoneNumber}
                onChange={handleChange}
                className={errors.phoneNumber ? "border-red-500" : ""}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={address.address}
              onChange={handleChange}
              className={errors.address ? "border-red-500" : ""}
            />
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={address.city}
                onChange={handleChange}
                className={errors.city ? "border-red-500" : ""}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                name="state"
                value={address.state}
                onChange={handleChange}
                className={errors.state ? "border-red-500" : ""}
              />
              {errors.state && <p className="text-red-500 text-sm">{errors.state}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">ZIP Code</Label>
              <Input
                id="zipCode"
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                className={errors.zipCode ? "border-red-500" : ""}
              />
              {errors.zipCode && <p className="text-red-500 text-sm">{errors.zipCode}</p>}
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit">Continue to Payment</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
