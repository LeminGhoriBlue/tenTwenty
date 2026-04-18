import { NextRequest, NextResponse } from "next/server"
import { entriesStore } from "@/data/store"

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const { id, entryId } = await params
  const body = await req.json()
  const index = entriesStore.findIndex((e) => e.id === entryId && e.weekId === id)
  if (index === -1) return NextResponse.json({ message: "Not found." }, { status: 404 })
  entriesStore[index] = { ...entriesStore[index], ...body }
  return NextResponse.json(entriesStore[index])
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ id: string; entryId: string }> }
) {
  const { id, entryId } = await params
  const index = entriesStore.findIndex((e) => e.id === entryId && e.weekId === id)
  if (index === -1) return NextResponse.json({ message: "Not found." }, { status: 404 })
  entriesStore.splice(index, 1)
  return NextResponse.json({ success: true })
}