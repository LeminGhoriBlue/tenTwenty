"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function TimesheetsRouteError({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="rounded-xl bg-white p-10 shadow-sm text-center">
      <h2 className="text-lg font-semibold text-gray-800">Failed to load timesheets</h2>
      <p className="mt-2 text-sm text-gray-500">{error.message || "Something went wrong."}</p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-md border border-border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  )
}