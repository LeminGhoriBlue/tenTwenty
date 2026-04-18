import { describe, expect, it } from "vitest"
import type { Week } from "@/lib/types"
import {
  compareWeeks,
  getWeekActionLabel,
  type SortColumn,
} from "./timesheetSort"

const w = (
  id: string,
  weekNumber: number,
  startDate: string,
  endDate: string,
  status: string
): Week => ({
  id,
  weekNumber,
  startDate,
  endDate,
  status,
})

describe("compareWeeks", () => {
  const a = w("a", 2, "2026-04-13", "2026-04-17", "Incomplete")
  const b = w("b", 1, "2026-04-06", "2026-04-10", "Completed")

  it("sorts by weekNumber ascending", () => {
    expect(compareWeeks(a, b, "weekNumber", "asc")).toBeGreaterThan(0)
    expect(compareWeeks(b, a, "weekNumber", "asc")).toBeLessThan(0)
  })

  it("sorts by weekNumber descending", () => {
    expect(compareWeeks(a, b, "weekNumber", "desc")).toBeLessThan(0)
  })

  it("sorts by startDate then endDate", () => {
    const earlier = w("e", 1, "2026-04-06", "2026-04-10", "Missing")
    const later = w("l", 1, "2026-04-13", "2026-04-17", "Missing")
    expect(compareWeeks(earlier, later, "date", "asc")).toBeLessThan(0)

    const sameStart1 = w("x", 1, "2026-04-06", "2026-04-08", "Missing")
    const sameStart2 = w("y", 1, "2026-04-06", "2026-04-10", "Missing")
    expect(compareWeeks(sameStart1, sameStart2, "date", "asc")).toBeLessThan(0)
  })

  it("sorts by status alphabetically", () => {
    const completed = w("c", 1, "2026-04-01", "2026-04-05", "Completed")
    const missing = w("m", 1, "2026-04-01", "2026-04-05", "Missing")
    expect(compareWeeks(completed, missing, "status", "asc")).toBeLessThan(0)
    expect(compareWeeks(missing, completed, "status", "desc")).toBeLessThan(0)
  })

  it("returns 0 for equal keys", () => {
    const twin = { ...a }
    expect(compareWeeks(a, twin, "weekNumber", "asc")).toBe(0)
    expect(compareWeeks(a, twin, "date", "asc")).toBe(0)
    expect(compareWeeks(a, twin, "status", "asc")).toBe(0)
  })

  it.each<[SortColumn]>([["weekNumber"], ["date"], ["status"]])(
    "respects direction for column %s",
    (column) => {
      const x = w("x", 1, "2026-01-01", "2026-01-05", "Completed")
      const y = w("y", 2, "2026-01-08", "2026-01-12", "Incomplete")
      const asc = compareWeeks(x, y, column, "asc")
      const desc = compareWeeks(x, y, column, "desc")
      expect(asc).toBe(-desc)
    }
  )
})

describe("getWeekActionLabel", () => {
  it("maps status to dashboard action labels", () => {
    expect(getWeekActionLabel("Completed")).toBe("View")
    expect(getWeekActionLabel("Incomplete")).toBe("Update")
    expect(getWeekActionLabel("Missing")).toBe("Create")
  })
})
