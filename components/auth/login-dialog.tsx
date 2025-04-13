"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/components/ui/use-toast"

export function LoginDialog() {
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

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
      router.refresh()
    }
    setIsLoading(false)
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.currentTarget)
    const email = formData.get("signup-email") as string
    const password = formData.get("signup-password") as string
    const name = formData.get("name") as string

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
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
        description: "Signed up successfully. Please check your email for verification.",
      })
    }
    setIsLoading(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="text-white">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] p-0 bg-white">
        <DialogHeader className="p-4 pb-0">
          <DialogTitle className="text-center text-xl font-semibold">Welcome to GossipGoods</DialogTitle>
        </DialogHeader>
        
        <div className="w-full">
          <div className="grid w-full grid-cols-2 bg-gray-100 rounded-t-lg">
            <button 
              onClick={() => setActiveTab("login")}
              className={`py-3 text-center font-medium transition-colors ${activeTab === "login" ? "bg-white" : "hover:bg-gray-200"}`}
            >
              Login
            </button>
            <button 
              onClick={() => setActiveTab("signup")}
              className={`py-3 text-center font-medium transition-colors ${activeTab === "signup" ? "bg-white" : "hover:bg-gray-200"}`}
            >
              Sign Up
            </button>
          </div>
          
          <div className="p-6">
            {activeTab === "login" ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <Input id="email" name="email" type="email" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Password</p>
                  <Input id="password" name="password" type="password" required className="h-12" />
                </div>
                <Button type="submit" className="w-full h-12 mt-4 bg-black hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Login"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Email</p>
                  <Input id="signup-email" name="signup-email" type="email" required className="h-12" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 mb-1">Password</p>
                  <Input id="signup-password" name="signup-password" type="password" required className="h-12" />
                </div>
                <Button type="submit" className="w-full h-12 mt-4 bg-black hover:bg-gray-800" disabled={isLoading}>
                  {isLoading ? "Loading..." : "Sign Up"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
