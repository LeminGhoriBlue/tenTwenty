import { NextRequest, NextResponse } from "next/server"
import { weeksStore } from "@/data/store"

export async function GET() {
  return NextResponse.json(weeksStore)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const newWeek = { id: `w${Date.now()}`, ...body }
  weeksStore.push(newWeek)
  return NextResponse.json(newWeek, { status: 201 })
}