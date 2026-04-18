import { describe, expect, it } from "vitest"
import { render, screen } from "@testing-library/react"
import TimesheetTableEmptyRow from "./TimesheetTableEmptyRow"

describe("TimesheetTableEmptyRow", () => {
  it("renders default message inside a single cell row", () => {
    render(
      <table>
        <tbody>
          <TimesheetTableEmptyRow />
        </tbody>
      </table>
    )
    expect(screen.getByText("No data found.")).toBeInTheDocument()
    expect(screen.getByRole("cell", { name: /no data found/i })).toHaveAttribute(
      "colSpan",
      "4"
    )
  })

  it("renders custom message", () => {
    render(
      <table>
        <tbody>
          <TimesheetTableEmptyRow message="Nothing here." colSpan={3} />
        </tbody>
      </table>
    )
    expect(screen.getByText("Nothing here.")).toBeInTheDocument()
    expect(
      screen.getByRole("cell", { name: /nothing here/i })
    ).toHaveAttribute("colSpan", "3")
  })
})
