import { NextRequest, NextResponse } from "next/server"
import { entriesStore } from "@/data/store"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const result = entriesStore.filter((e) => e.weekId === id)
  return NextResponse.json(result)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await req.json()
  const newEntry = { id: `e${Date.now()}`, weekId: id, ...body }
  entriesStore.push(newEntry)
  return NextResponse.json(newEntry, { status: 201 })
}