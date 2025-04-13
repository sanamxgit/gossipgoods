"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import type React from "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

interface Product3DViewerProps {
  glbUrl: string
  usdzUrl: string
}

export function Product3DViewer({ glbUrl, usdzUrl }: Product3DViewerProps) {
  const modelViewerRef = useRef<HTMLElement>(null)
  const [showQR, setShowQR] = useState(false)
  const [deviceType, setDeviceType] = useState<"ios" | "android" | "other">("other")

  useEffect(() => {
    import("@google/model-viewer")
  }, [])

  useEffect(() => {
    // Detect device type on component mount
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    const isAndroid = /Android/.test(navigator.userAgent)

    if (isIOS) {
      setDeviceType("ios")
    } else if (isAndroid) {
      setDeviceType("android")
    } else {
      setDeviceType("other")
    }
  }, [])

  const handleARClick = () => {
    if (deviceType === "ios") {
      // For iOS, directly link to the USDZ file with a special URL scheme
      // This will trigger AR QuickLook
      window.location.href = `https://sanamxgit.github.io/models/untitled.usdz`
    } else if (deviceType === "android") {
      const encodedGlbUrl = encodeURIComponent(glbUrl)
      window.location.href = `intent://arvr.google.com/scene-viewer/1.0?file=${encodedGlbUrl}&mode=ar_only&title=3D%20Model#Intent;scheme=https;package=com.google.android.googlequicksearchbox;action=android.intent.action.VIEW;end;`
    } else {
      setShowQR(true)
    }
  }

  const getIOSQRValue = () => {
    // Direct link to the USDZ file on GitHub Pages
    return `https://sanamxgit.github.io/models/untitled.usdz`
  }

  const getAndroidQRValue = () => {
    const encodedGlbUrl = encodeURIComponent(`https://sanamxgit.github.io/models/untitled.glb`)
    return `market://details?id=com.google.android.googlequicksearchbox&url=${encodeURIComponent(`https://arvr.google.com/scene-viewer/1.0?file=${encodedGlbUrl}&mode=ar_only&title=3D%20Model`)}`
  }

  return (
    <div className="relative w-full h-full">
      <model-viewer
        ref={modelViewerRef}
        src={glbUrl}
        ios-src={usdzUrl}
        alt="3D model"
        camera-controls
        auto-rotate
        shadow-intensity="1"
        environment-image="neutral"
        exposure="1"
        ar
        ar-modes="webxr scene-viewer quick-look"
        className="w-full h-full"
        loading="eager"
      >
        <Button className="absolute bottom-4 right-4 bg-white text-black hover:bg-gray-200" onClick={handleARClick}>
          AR+
        </Button>
      </model-viewer>
      {showQR && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Scan QR Code for AR</h2>
            <div className="flex justify-around">
              <div className="text-center">
                <h3 className="font-semibold mb-2">iOS (AR QuickLook)</h3>
                <QRCodeSVG value={getIOSQRValue()} size={128} />
              </div>
              <div className="text-center">
                <h3 className="font-semibold mb-2">Android (Scene Viewer)</h3>
                <QRCodeSVG value={getAndroidQRValue()} size={128} />
              </div>
            </div>
            <p className="mt-4 text-sm text-gray-600">
              Scan the appropriate QR code with your mobile device to view in AR
            </p>
            <Button className="mt-4 w-full" onClick={() => setShowQR(false)}>
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
