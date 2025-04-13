"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  product: any
  step: number
  onBack: () => void
  onNext: () => void
  loading: boolean
  buttonText: string
}

export function OrderSummary({ product, step, onBack, onNext, loading, buttonText }: OrderSummaryProps) {
  // Calculate shipping cost and tax
  const productPrice = product?.price || 0
  const shippingCost = 100 // Fixed shipping cost
  const tax = productPrice * 0.13 // 13% tax
  const total = productPrice + shippingCost + tax

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {product ? (
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center">
              <img
                src={product.image || "/placeholder.svg?height=64&width=64"}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">Qty: 1</p>
            </div>
            <div className="font-medium">Rs. {productPrice.toFixed(2)}</div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-gray-500">No product selected</p>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-500">Subtotal</span>
            <span>Rs. {productPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Shipping</span>
            <span>Rs. {shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Tax (13%)</span>
            <span>Rs. {tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>Rs. {total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {step > 1 && (
          <Button variant="outline" onClick={onBack}>
            Back
          </Button>
        )}
        <Button onClick={onNext} disabled={loading} className={step === 1 ? "ml-auto" : ""}>
          {loading ? (
            <>
              <span className="animate-spin mr-2">⟳</span>
              Processing...
            </>
          ) : (
            buttonText
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
