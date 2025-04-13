"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { SiteHeader } from "@/components/navbar"
import { SiteFooter } from "@/components/site-footer"
import { AddressForm } from "@/components/checkout/address-form"
import { PaymentOptions } from "@/components/checkout/payment-options"
import { OrderSummary } from "@/components/checkout/order-summary"
import { CheckoutSteps } from "@/components/checkout/checkout-steps"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function CheckoutPage() {
  const [step, setStep] = useState(1)
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "esewa">("cod")
  const [esewaPhone, setEsewaPhone] = useState("")
  const [otp, setOtp] = useState("")
  const [showOtpInput, setShowOtpInput] = useState(false)

  const searchParams = useSearchParams()
  const productId = searchParams.get("productId")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    if (productId) {
      fetchProduct(productId)
    } else {
      setLoading(false)
    }
  }, [productId])

  const fetchProduct = async (id: string) => {
    try {
      const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

      if (error) throw error

      setProduct(data)
    } catch (error) {
      console.error("Error fetching product:", error)
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSubmit = (addressData: typeof address) => {
    setAddress(addressData)
    setStep(2)
  }

  const handlePaymentMethodSelect = (method: "cod" | "esewa") => {
    setPaymentMethod(method)
  }

  const handleEsewaPhoneSubmit = () => {
    if (!esewaPhone || esewaPhone.length < 10) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would send the phone number to your backend
    // and the backend would trigger an OTP to be sent to the user

    // For demo purposes, we'll simulate an OTP being sent
    toast({
      title: "OTP Sent",
      description: `A verification code has been sent to ${esewaPhone}`,
    })

    setShowOtpInput(true)
  }

  const verifyOtp = () => {
    // In a real app, you would verify the OTP with your backend

    // For demo purposes, we'll accept any 4-digit OTP
    if (otp.length !== 4) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 4-digit OTP",
        variant: "destructive",
      })
      return
    }

    // Simulate successful payment
    placeOrder()
  }

  const placeOrder = async () => {
    try {
      setLoading(true)

      // Get the current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please log in to place an order",
          variant: "destructive",
        })
        return
      }

      // Create an order in the database
      const { data, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          product_id: productId,
          total_amount: product?.price || 0,
          payment_method: paymentMethod,
          shipping_address: address,
          status: paymentMethod === "cod" ? "pending" : "paid",
        })
        .select()

      if (error) throw error

      // Navigate to order confirmation page
      router.push(`/checkout/confirmation?orderId=${data[0].id}`)
    } catch (error) {
      console.error("Error placing order:", error)
      toast({
        title: "Error",
        description: "Failed to place your order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlaceOrder = () => {
    if (paymentMethod === "cod") {
      placeOrder()
    } else if (paymentMethod === "esewa" && !showOtpInput) {
      handleEsewaPhoneSubmit()
    } else if (paymentMethod === "esewa" && showOtpInput) {
      verifyOtp()
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

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />
      <main className="flex-grow container py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <CheckoutSteps currentStep={step} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          <div className="md:col-span-2">
            {step === 1 && <AddressForm initialAddress={address} onSubmit={handleAddressSubmit} />}

            {step === 2 && (
              <PaymentOptions
                selectedMethod={paymentMethod}
                onSelectMethod={handlePaymentMethodSelect}
                esewaPhone={esewaPhone}
                setEsewaPhone={setEsewaPhone}
                showOtpInput={showOtpInput}
                otp={otp}
                setOtp={setOtp}
              />
            )}
          </div>

          <div className="md:col-span-1">
            <OrderSummary
              product={product}
              step={step}
              onBack={() => setStep(step - 1)}
              onNext={handlePlaceOrder}
              loading={loading}
              buttonText={paymentMethod === "cod" ? "Place Order" : showOtpInput ? "Verify & Pay" : "Continue to Pay"}
            />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
