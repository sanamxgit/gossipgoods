"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ModelViewerProps {
  glbUrl: string
  usdzUrl: string
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}

export function ModelViewer({ glbUrl, usdzUrl }: ModelViewerProps) {
  const modelViewerRef = useRef<HTMLElement>(null)
  const [isModelViewerReady, setIsModelViewerReady] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadModelViewer = async () => {
      try {
        const ModelViewerModule = await import("@google/model-viewer")
        if (isMounted) {
          setIsModelViewerReady(true)
        }
      } catch (error) {
        console.error("Error loading @google/model-viewer:", error)
      }
    }

    loadModelViewer()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    if (isModelViewerReady && modelViewerRef.current) {
      const modelViewer = modelViewerRef.current as any

      modelViewer.addEventListener("load", () => {
        // The model has loaded, now it's safe to perform operations
        try {
          const fieldOfView = modelViewer.getFieldOfView()
          console.log("Field of View:", fieldOfView)
        } catch (error) {
          console.error("Error accessing model viewer properties:", error)
        }
      })

      modelViewer.addEventListener("error", (error: ErrorEvent) => {
        console.error("Error in model viewer:", error)
      })
    }
  }, [isModelViewerReady])

  if (!isModelViewerReady) {
    return <div>Loading 3D viewer...</div>
  }

  return (
    <div className="w-full h-[400px]">
      <model-viewer
        ref={modelViewerRef}
        src={glbUrl}
        ios-src={usdzUrl}
        alt="3D model preview"
        camera-controls
        auto-rotate
        ar
        ar-modes="webxr scene-viewer quick-look"
        className="w-full h-full"
      ></model-viewer>
    </div>
  )
}
