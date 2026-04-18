import type { Week } from "@/lib/types"

export type SortColumn = "weekNumber" | "date" | "status"

export function compareWeeks(
  a: Week,
  b: Week,
  column: SortColumn,
  dir: "asc" | "desc"
): number {
  const sign = dir === "asc" ? 1 : -1
  if (column === "weekNumber") {
    return sign * (a.weekNumber - b.weekNumber)
  }
  if (column === "date") {
    const cmp = a.startDate.localeCompare(b.startDate)
    if (cmp !== 0) return sign * cmp
    return sign * a.endDate.localeCompare(b.endDate)
  }
  return sign * a.status.localeCompare(b.status)
}

export function getWeekActionLabel(status: string): string {
  if (status === "Completed") return "View"
  if (status === "Incomplete") return "Update"
  return "Create"
}
