import { useState } from "react"
import { describe, expect, it, vi } from "vitest"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import ValidatedFormField from "./ValidatedFormField"

describe("ValidatedFormField", () => {
  it("renders label and text input", () => {
    const onChange = vi.fn()
    render(
      <ValidatedFormField
        id="email"
        label="Email"
        value=""
        onChange={onChange}
      />
    )
    expect(screen.getByLabelText("Email")).toBeInTheDocument()
  })

  it("shows required asterisk when required", () => {
    render(
      <ValidatedFormField
        id="x"
        label="Field"
        value=""
        required
        onChange={() => {}}
      />
    )
    expect(screen.getByText("*")).toHaveClass("text-red-500")
  })

  it("shows error message and hides hint when error is set", () => {
    render(
      <ValidatedFormField
        id="x"
        label="Field"
        value="bad"
        error="Too short"
        hint="Optional hint"
        onChange={() => {}}
      />
    )
    expect(screen.getByText("Too short")).toBeInTheDocument()
    expect(screen.queryByText("Optional hint")).not.toBeInTheDocument()
  })

  it("shows hint when no error", () => {
    render(
      <ValidatedFormField
        id="x"
        label="Field"
        value="ok"
        hint="Helper text"
        onChange={() => {}}
      />
    )
    expect(screen.getByText("Helper text")).toBeInTheDocument()
  })

  it("calls onChange when typing in text input", async () => {
    const user = userEvent.setup()
    function Harness() {
      const [value, setValue] = useState("")
      return (
        <ValidatedFormField
          id="name"
          label="Name"
          value={value}
          onChange={setValue}
        />
      )
    }
    render(<Harness />)
    await user.type(screen.getByLabelText("Name"), "Ada")
    expect(screen.getByLabelText("Name")).toHaveValue("Ada")
  })

  it("renders select and propagates changes", async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(
      <ValidatedFormField
        id="proj"
        label="Project"
        type="select"
        placeholder="Pick one"
        value="A"
        options={[
          { label: "Alpha", value: "A" },
          { label: "Beta", value: "B" },
        ]}
        onChange={onChange}
      />
    )
    await user.selectOptions(screen.getByLabelText("Project"), "B")
    expect(onChange).toHaveBeenCalledWith("B")
  })

  it("renders textarea", () => {
    render(
      <ValidatedFormField
        id="notes"
        label="Notes"
        type="textarea"
        value="Line"
        onChange={() => {}}
      />
    )
    expect(screen.getByLabelText("Notes")).toHaveProperty("tagName", "TEXTAREA")
  })
})
