"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

export default function ARViewer() {
  const searchParams = useSearchParams()
  const modelUrl = searchParams.get("url")
  const [apiUrl, setApiUrl] = useState("")

  useEffect(() => {
    if (modelUrl) {
      // Create the API URL on the client side to ensure we have the correct origin
      const url = new URL(`${window.location.origin}/api/ar-model`)
      url.searchParams.append("url", modelUrl)
      setApiUrl(url.toString())
    }
  }, [modelUrl])

  // iOS requires user interaction to launch AR QuickLook
  // But we can make the page very simple with a prominent button
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-6">View in AR</h1>

        {modelUrl ? (
          <>
            <p className="mb-6">Click the button below to view this product in augmented reality.</p>

            {apiUrl && (
              <a
                href={apiUrl}
                rel="ar"
                className="inline-block bg-black text-white font-bold py-3 px-6 rounded-lg text-lg"
              >
                Launch AR View
              </a>
            )}

            <p className="mt-6 text-sm text-gray-500">
              Note: AR QuickLook is only available on iOS devices (iPhone/iPad).
            </p>
          </>
        ) : (
          <p className="text-red-500">Error: No model URL provided</p>
        )}
      </div>
    </div>
  )
}
