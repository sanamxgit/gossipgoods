import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const modelUrl = searchParams.get("url")

  if (!modelUrl) {
    return new NextResponse("Missing model URL parameter", { status: 400 })
  }

  try {
    // Fetch the USDZ file
    const response = await fetch(modelUrl)

    if (!response.ok) {
      return new NextResponse(`Failed to fetch model: ${response.statusText}`, { status: response.status })
    }

    const arrayBuffer = await response.arrayBuffer()

    // Return the file with proper headers for AR QuickLook
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "model/vnd.usdz+zip",
        "Content-Disposition": 'inline; filename="model.usdz"',
        // Add cache control to prevent caching issues
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    })
  } catch (error) {
    console.error("Error fetching model:", error)
    return new NextResponse("Error fetching model", { status: 500 })
  }
}
