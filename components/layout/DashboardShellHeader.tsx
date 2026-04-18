"use client"

import { useAuth } from "@/hooks/useAuth"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function DashboardShellHeader({ title }: { title: string }) {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)

  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-white px-6">
      <div className="flex items-center gap-6">
        <span className="text-lg font-bold text-gray-900">ticktock</span>
        <span className="text-sm text-gray-600">{title}</span>
      </div>

      <div className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-1 text-sm text-gray-700 hover:text-gray-900"
        >
          {user?.name ?? "User"}
          <ChevronDown size={14} />
        </button>

        {open && (
          <div className="absolute right-0 top-8 z-10 w-36 rounded-md border border-border bg-white shadow-md">
            <button
              onClick={logout}
              className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}