import { describe, expect, it, vi } from "vitest"
import { cn, formatDate, formatWeekDateRange, getDateRangeBounds } from "./utils"

describe("cn", () => {
  it("merges tailwind classes", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4")
  })

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", true && "block")).toBe("base block")
  })
})

describe("formatWeekDateRange", () => {
  it("formats same month and year", () => {
    expect(formatWeekDateRange("2026-01-01", "2026-01-05")).toBe(
      "1 - 5 January 2026"
    )
  })

  it("formats same year, different months", () => {
    expect(formatWeekDateRange("2026-01-28", "2026-02-02")).toBe(
      "28 January - 2 February 2026"
    )
  })

  it("formats across years", () => {
    expect(formatWeekDateRange("2025-02-02", "2026-01-01")).toBe(
      "2 February 2025 - 1 January 2026"
    )
  })

  it("formats single day within month", () => {
    expect(formatWeekDateRange("2026-01-05", "2026-01-05")).toBe(
      "5 - 5 January 2026"
    )
  })
})

describe("formatDate", () => {
  it("formats ISO date string for en-GB short month", () => {
    const out = formatDate("2026-03-15")
    expect(out).toContain("Mar")
    expect(out).toContain("2026")
    expect(out).toMatch(/\d{1,2}\s+\w+\s+\d{4}/)
  })
})

describe("getDateRangeBounds", () => {
  it("returns null for unknown range key", () => {
    expect(getDateRangeBounds("")).toBeNull()
    expect(getDateRangeBounds("invalid")).toBeNull()
  })

  it("returns calendar month bounds for this_month", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-18T12:00:00"))

    const bounds = getDateRangeBounds("this_month")
    expect(bounds).not.toBeNull()
    expect(bounds!.from.getFullYear()).toBe(2026)
    expect(bounds!.from.getMonth()).toBe(3)
    expect(bounds!.from.getDate()).toBe(1)
    expect(bounds!.to.getMonth()).toBe(3)
    expect(bounds!.to.getDate()).toBe(30)

    vi.useRealTimers()
  })

  it("returns Monday–Sunday for this_week", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-13T12:00:00"))

    const bounds = getDateRangeBounds("this_week")
    expect(bounds!.from.getDay()).toBe(1)
    expect(bounds!.to.getDay()).toBe(0)
    expect(bounds!.from.getDate()).toBe(13)
    expect(bounds!.to.getDate()).toBe(19)

    vi.useRealTimers()
  })

  it("returns previous full week for last_week", () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-13T12:00:00"))

    const bounds = getDateRangeBounds("last_week")
    expect(bounds!.from.getDate()).toBe(6)
    expect(bounds!.to.getDate()).toBe(12)

    vi.useRealTimers()
  })
})
