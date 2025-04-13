"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { SiteHeader } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, ShoppingBag } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    if (orderId) {
      fetchOrder(orderId)
    } else {
      setLoading(false)
    }
  }, [orderId])

  const fetchOrder = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          products:product_id (
            name,
            price,
            image
          )
        `)
        .eq("id", id)
        .single()

      if (error) throw error

      setOrder(data)
    } catch (error) {
      console.error("Error fetching order:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </main>
        <SiteFooter />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col">
        <SiteHeader />
        <main className="flex-grow container py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Order Not Found</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <p>We couldn't find the order you're looking for.</p>
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <SiteFooter />
      </div>
    )
  }

  // Calculate order totals
  const productPrice = order.products?.price || 0
  const shippingCost = 100
  const tax = productPrice * 0.13
  const total = productPrice + shippingCost + tax

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl">Order Confirmed!</CardTitle>
            <p className="text-gray-500 mt-2">Thank you for your purchase. Your order has been confirmed.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Order Number:</span>
                <span>{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{new Date(order.created_at).toLocaleDateString()}</span>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Order Details</h3>
              <div className="border rounded-md">
                <div className="flex items-center p-4 border-b">
                  <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center mr-4">
                    <img
                      src={order.products?.image || "/placeholder.svg?height=64&width=64"}
                      alt={order.products?.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{order.products?.name}</h4>
                    <p className="text-sm text-gray-500">Qty: 1</p>
                  </div>
                  <div className="font-medium">Rs. {productPrice.toFixed(2)}</div>
                </div>
                <div className="p-4 space-y-2">
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
                  <div className="flex justify-between font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>Rs. {total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Shipping Address</h3>
              <div className="border rounded-md p-4">
                <p>{order.shipping_address.fullName}</p>
                <p>{order.shipping_address.address}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.zipCode}
                </p>
                <p>Phone: {order.shipping_address.phoneNumber}</p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Payment Method</h3>
              <div className="border rounded-md p-4">
                <p>{order.payment_method === "cod" ? "Cash on Delivery" : "eSewa"}</p>
                <p className="text-sm text-gray-500">
                  {order.payment_method === "cod" ? "Pay when your order is delivered" : "Payment completed"}
                </p>
              </div>
            </div>

            <div className="flex justify-center space-x-4 pt-4">
              <Button asChild variant="outline">
                <Link href="/">Continue Shopping</Link>
              </Button>
              <Button asChild>
                <Link href="/account/orders">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  View Orders
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  )
}
