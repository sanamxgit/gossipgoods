"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

interface CartItem {
  id: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (productId: string) => Promise<void>
  removeFromCart: (productId: string) => Promise<void>
  cartCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])

  useEffect(() => {
    const fetchCart = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("cart").select("*").eq("user_id", user.id)

        if (error) {
          console.error("Error fetching cart:", error)
        } else {
          setCartItems(data || [])
        }
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (productId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("User not logged in")
      return
    }

    const existingItem = cartItems.find((item) => item.id === productId)

    if (existingItem) {
      const { data, error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + 1 })
        .eq("user_id", user.id)
        .eq("id", productId)

      if (error) {
        console.error("Error updating cart:", error)
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item)),
        )
      }
    } else {
      const { data, error } = await supabase.from("cart").insert({ user_id: user.id, id: productId, quantity: 1 })

      if (error) {
        console.error("Error adding to cart:", error)
      } else {
        setCartItems((prevItems) => [...prevItems, { id: productId, quantity: 1 }])
      }
    }
  }

  const removeFromCart = async (productId: string) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.error("User not logged in")
      return
    }

    const { error } = await supabase.from("cart").delete().eq("user_id", user.id).eq("id", productId)

    if (error) {
      console.error("Error removing from cart:", error)
    } else {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
    }
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, cartCount }}>{children}</CartContext.Provider>
  )
}
