import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import RetryErrorAlert from "./RetryErrorAlert"

describe("RetryErrorAlert", () => {
  it("shows message and retry button when onRetry is provided", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()

    render(
      <RetryErrorAlert message="Network failed" onRetry={onRetry} />
    )

    expect(screen.getByText("Network failed")).toBeInTheDocument()
    await user.click(screen.getByRole("button", { name: /try again/i }))
    expect(onRetry).toHaveBeenCalledTimes(1)
  })

  it("omits retry when onRetry is absent", () => {
    render(<RetryErrorAlert message="Oops" />)
    expect(screen.queryByRole("button", { name: /try again/i })).not.toBeInTheDocument()
  })

  it("uses default message when message prop omitted", () => {
    render(<RetryErrorAlert />)
    expect(
      screen.getByText("Something went wrong.")
    ).toBeInTheDocument()
  })
})
