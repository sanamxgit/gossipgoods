"use client"

import { CreditCard, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface PaymentOptionsProps {
  selectedMethod: "cod" | "esewa"
  onSelectMethod: (method: "cod" | "esewa") => void
  esewaPhone: string
  setEsewaPhone: (phone: string) => void
  showOtpInput: boolean
  otp: string
  setOtp: (otp: string) => void
}

export function PaymentOptions({
  selectedMethod,
  onSelectMethod,
  esewaPhone,
  setEsewaPhone,
  showOtpInput,
  otp,
  setOtp,
}: PaymentOptionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedMethod}
          onValueChange={(value) => onSelectMethod(value as "cod" | "esewa")}
          className="space-y-4"
        >
          <div className="flex items-center space-x-2 border rounded-md p-4">
            <RadioGroupItem value="cod" id="cod" />
            <Label htmlFor="cod" className="flex items-center cursor-pointer">
              <Truck className="mr-2 h-5 w-5" />
              Cash on Delivery
            </Label>
          </div>

          <div className="border rounded-md p-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="esewa" id="esewa" />
              <Label htmlFor="esewa" className="flex items-center cursor-pointer">
                <CreditCard className="mr-2 h-5 w-5" />
                eSewa
              </Label>
            </div>

            {selectedMethod === "esewa" && (
              <div className="mt-4 pl-6">
                {!showOtpInput ? (
                  <div className="space-y-2">
                    <Label htmlFor="esewaPhone">eSewa Registered Phone Number</Label>
                    <Input
                      id="esewaPhone"
                      value={esewaPhone}
                      onChange={(e) => setEsewaPhone(e.target.value)}
                      placeholder="Enter your eSewa phone number"
                      type="tel"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter OTP sent to {esewaPhone}</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="otp"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                      />
                      <Button variant="outline" onClick={() => setOtp("")}>
                        Resend
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
