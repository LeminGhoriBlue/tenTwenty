import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import TimesheetStatusBadge from "./TimesheetStatusBadge"

describe("TimesheetStatusBadge", () => {
  it("renders status text for each known status", () => {
    for (const status of ["Completed", "Incomplete", "Missing"] as const) {
      const { unmount } = render(<TimesheetStatusBadge status={status} />)
      expect(screen.getByText(status)).toBeInTheDocument()
      unmount()
    }
  })

  it("applies completed styling class", () => {
    const { container } = render(<TimesheetStatusBadge status="Completed" />)
    const span = container.firstElementChild
    expect(span).toHaveClass("uppercase")
    expect(span?.className).toContain("#03543F")
  })

  it("falls back styling for unknown status", () => {
    const { container } = render(<TimesheetStatusBadge status="Unknown" />)
    expect(screen.getByText("Unknown")).toBeInTheDocument()
    expect(container.firstElementChild?.className).toContain("gray")
  })
})
