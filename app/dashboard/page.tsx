"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useTimesheets } from "@/hooks/useTimesheets"
import TimesheetStatusBadge from "@/components/timesheets/TimesheetStatusBadge"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react"
import { formatWeekDateRange, getDateRangeBounds } from "@/lib/utils"
import {
  compareWeeks,
  getWeekActionLabel,
  type SortColumn,
} from "@/lib/timesheetSort"
import type { Week } from "@/lib/types"
import RetryErrorAlert from "@/components/errors/RetryErrorAlert"
import TimesheetTableEmptyRow from "@/components/errors/TimesheetTableEmptyRow"

const PAGE_SIZE_OPTIONS = [5, 10, 20]

export default function TimesheetsOverviewPage() {
  const { weeks, loading, error, fetchWeeks } = useTimesheets()
  const router = useRouter()

  const [dateRange, setDateRange] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [pageSize, setPageSize] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)
  const [sort, setSort] = useState<{
    column: SortColumn
    dir: "asc" | "desc"
  }>({ column: "weekNumber", dir: "asc" })

  useEffect(() => {
    fetchWeeks()
  }, [fetchWeeks])

  const dateRangeBounds = useMemo(
    () => (dateRange ? getDateRangeBounds(dateRange) : null),
    [dateRange]
  )

  const filteredWeeks = useMemo(() => {
    return weeks
      .filter((w: Week) => {
        if (statusFilter && w.status !== statusFilter) return false

        if (dateRangeBounds) {
          const weekStart = new Date(w.startDate)
          const weekEnd = new Date(w.endDate)
          if (weekEnd < dateRangeBounds.from || weekStart > dateRangeBounds.to) return false
        }

        return true
      })
      .sort((a: Week, b: Week) => compareWeeks(a, b, sort.column, sort.dir))
  }, [weeks, statusFilter, dateRangeBounds, sort])

  const handleSort = useCallback((column: SortColumn) => {
    setCurrentPage(1)
    setSort((prev) =>
      prev.column === column
        ? { column, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { column, dir: "asc" }
    )
  }, [])

  const { paginatedWeeks, totalPages } = useMemo(() => {
    const total = Math.ceil(filteredWeeks.length / pageSize)
    const start = (currentPage - 1) * pageSize
    return {
      paginatedWeeks: filteredWeeks.slice(start, start + pageSize),
      totalPages: total,
    }
  }, [filteredWeeks, currentPage, pageSize])

  const goToWeek = useCallback(
    (weekId: string) => {
      router.push(`/dashboard/${weekId}`)
    },
    [router]
  )

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <h1 className="mb-5 text-2xl font-semibold text-gray-900">Your Timesheets</h1>

      <div className="mb-5 flex gap-3">
        <select
          value={dateRange}
          onChange={(e) => {
            setDateRange(e.target.value)
            setCurrentPage(1)
          }}
          className="rounded-md border border-input px-3 py-1.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Date Range</option>
          <option value="this_week">This Week</option>
          <option value="last_week">Last Week</option>
          <option value="this_month">This Month</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setCurrentPage(1)
          }}
          className="rounded-md border border-input px-3 py-1.5 text-sm text-gray-600 outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="">Status</option>
          <option value="Completed">Completed</option>
          <option value="Incomplete">Incomplete</option>
          <option value="Missing">Missing</option>
        </select>
      </div>

      {!loading && error && (
        <div className="mb-4">
          <RetryErrorAlert message={error} onRetry={fetchWeeks} />
        </div>
      )}

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-medium uppercase tracking-wide text-gray-400">
            <th className="py-3 text-left" aria-sort={sort.column === "weekNumber" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
              <button
                type="button"
                onClick={() => handleSort("weekNumber")}
                className={`flex items-center gap-1 hover:text-gray-600 ${sort.column === "weekNumber" ? "text-gray-600" : ""}`}
              >
                Week #
                {sort.column === "weekNumber" ? (
                  sort.dir === "asc" ? (
                    <ChevronDown size={12} className="shrink-0" aria-hidden />
                  ) : (
                    <ChevronUp size={12} className="shrink-0" aria-hidden />
                  )
                ) : (
                  <ChevronDown size={12} className="shrink-0 opacity-40" aria-hidden />
                )}
              </button>
            </th>
            <th className="py-3 text-left" aria-sort={sort.column === "date" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
              <button
                type="button"
                onClick={() => handleSort("date")}
                className={`flex items-center gap-1 hover:text-gray-600 ${sort.column === "date" ? "text-gray-600" : ""}`}
              >
                Date
                {sort.column === "date" ? (
                  sort.dir === "asc" ? (
                    <ChevronDown size={12} className="shrink-0" aria-hidden />
                  ) : (
                    <ChevronUp size={12} className="shrink-0" aria-hidden />
                  )
                ) : (
                  <ChevronDown size={12} className="shrink-0 opacity-40" aria-hidden />
                )}
              </button>
            </th>
            <th className="py-3 text-left" aria-sort={sort.column === "status" ? (sort.dir === "asc" ? "ascending" : "descending") : "none"}>
              <button
                type="button"
                onClick={() => handleSort("status")}
                className={`flex items-center gap-1 hover:text-gray-600 ${sort.column === "status" ? "text-gray-600" : ""}`}
              >
                Status
                {sort.column === "status" ? (
                  sort.dir === "asc" ? (
                    <ChevronDown size={12} className="shrink-0" aria-hidden />
                  ) : (
                    <ChevronUp size={12} className="shrink-0" aria-hidden />
                  )
                ) : (
                  <ChevronDown size={12} className="shrink-0 opacity-40" aria-hidden />
                )}
              </button>
            </th>
            <th className="py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading &&
            [...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-border">
                <td className="py-3">
                  <div className="h-4 w-8 animate-pulse rounded bg-gray-100" />
                </td>
                <td className="py-3">
                  <div className="h-4 w-48 animate-pulse rounded bg-gray-100" />
                </td>
                <td className="py-3">
                  <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
                </td>
                <td className="py-3 text-right">
                  <div className="ml-auto h-4 w-12 animate-pulse rounded bg-gray-100" />
                </td>
              </tr>
            ))}

          {!loading && !error && paginatedWeeks.length === 0 && (
            <TimesheetTableEmptyRow message="No timesheets found." />
          )}

          {!loading &&
            !error &&
            paginatedWeeks.map((week: Week) => (
              <tr key={week.id} className="border-b border-border hover:bg-gray-50">
                <td className="py-3 text-gray-700">{week.weekNumber}</td>
                <td className="py-3 text-gray-700">
                  {formatWeekDateRange(week.startDate, week.endDate)}
                </td>
                <td className="py-3">
                  <TimesheetStatusBadge status={week.status} />
                </td>
                <td className="py-3 text-right">
                  <button
                    type="button"
                    onClick={() => goToWeek(week.id)}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {getWeekActionLabel(week.status)}
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <div className="mt-5 flex items-center justify-between">
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
            setCurrentPage(1)
          }}
          className="rounded-md border border-input px-3 py-1.5 text-sm text-gray-600 outline-none"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>
              {s} per page
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1 text-sm">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="flex items-center gap-1 rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            <ChevronLeft size={14} /> Previous
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`rounded px-3 py-1 ${
                currentPage === i + 1
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="flex items-center gap-1 rounded px-2 py-1 text-gray-500 hover:bg-gray-100 disabled:opacity-40"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
