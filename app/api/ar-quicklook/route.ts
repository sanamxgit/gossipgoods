import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const usdzUrl = searchParams.get("model")

  if (!usdzUrl) {
    return new NextResponse("Missing model parameter", { status: 400 })
  }

  // Fetch the USDZ file
  const response = await fetch(usdzUrl)
  const arrayBuffer = await response.arrayBuffer()

  // Return the file with proper headers for AR QuickLook
  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "model/vnd.usdz+zip",
      "Content-Disposition": 'attachment; filename="model.usdz"',
    },
  })
}
