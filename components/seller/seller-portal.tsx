"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StoreDetails } from "@/components/seller/store-details"
import { ProductEditor } from "@/components/seller/product-editor"

export function SellerPortal() {
  const [storeData, setStoreData] = useState({
    name: "",
    description: "",
    logo: "",
  })

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    woodOptions: [],
    upholsteryOptions: [],
    images: [],
    glbUrl: "",
    usdzUrl: "",
  })

  const handleStoreUpdate = (data: typeof storeData) => {
    setStoreData(data)
    // TODO: Send update to backend
  }

  const handleProductUpdate = (data: typeof productData) => {
    setProductData(data)
    // TODO: Send update to backend
  }

  return (
    <Tabs defaultValue="store" className="w-full">
      <TabsList>
        <TabsTrigger value="store">Store Details</TabsTrigger>
        <TabsTrigger value="product">Product Editor</TabsTrigger>
      </TabsList>
      <TabsContent value="store">
        <StoreDetails data={storeData} onUpdate={handleStoreUpdate} />
      </TabsContent>
      <TabsContent value="product">
        <ProductEditor data={productData} onUpdate={handleProductUpdate} />
      </TabsContent>
    </Tabs>
  )
}
