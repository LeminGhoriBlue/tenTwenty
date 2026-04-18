import { NextRequest, NextResponse } from "next/server"
import { weeksStore } from "@/data/store"

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const index = weeksStore.findIndex((w) => w.id === id)
  if (index === -1) return NextResponse.json({ message: "Not found." }, { status: 404 })
  weeksStore[index] = { ...weeksStore[index], ...body }
  return NextResponse.json(weeksStore[index])
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const index = weeksStore.findIndex((w) => w.id === id)
  if (index === -1) return NextResponse.json({ message: "Not found." }, { status: 404 })
  weeksStore.splice(index, 1)
  return NextResponse.json({ success: true })
}