"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function SellerAuthDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("seller-email") as string
    const password = formData.get("seller-password") as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Logged in successfully",
      })
      router.push("/seller/brand-selection")
    }
    setIsLoading(false)
  }

  const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("business-email") as string
    const password = formData.get("new-password") as string
    const storeName = formData.get("store-name") as string
    const phone = formData.get("phone") as string
    const description = formData.get("description") as string

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          store_name: storeName,
          phone,
          description,
        },
      },
    })

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Registered successfully. Please check your email for verification.",
      })
      if (data.user) {
        router.push("/seller/brand-selection")
      }
    }
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-sm hover:text-gray-600">
          Become a seller
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Seller Portal</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Seller Login</TabsTrigger>
            <TabsTrigger value="register">Register Store</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seller-email">Email</Label>
                <Input id="seller-email" name="seller-email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seller-password">Password</Label>
                <Input id="seller-password" name="seller-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Login to Seller Portal"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="register">
            <form onSubmit={handleRegistration} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-name">Store Name</Label>
                <Input id="store-name" name="store-name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="business-email">Business Email</Label>
                <Input id="business-email" name="business-email" type="email" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Password</Label>
                <Input id="new-password" name="new-password" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Loading..." : "Register Store"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
