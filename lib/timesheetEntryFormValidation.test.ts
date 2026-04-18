import { describe, expect, it } from "vitest"
import {
  validateTimesheetEntryForm,
  type TimesheetEntryFormState,
} from "./timesheetEntryFormValidation"

const validBase: TimesheetEntryFormState = {
  project: "Ticktock",
  workType: "Feature",
  description: "Some task",
  hours: 8,
}

describe("validateTimesheetEntryForm", () => {
  it("returns empty object when valid", () => {
    expect(validateTimesheetEntryForm(validBase)).toEqual({})
  })

  it("requires project", () => {
    expect(
      validateTimesheetEntryForm({ ...validBase, project: "" }).project
    ).toBe("Project is required.")
  })

  it("requires work type", () => {
    expect(
      validateTimesheetEntryForm({ ...validBase, workType: "" }).workType
    ).toBe("Type of work is required.")
  })

  it("requires non-empty trimmed description", () => {
    expect(
      validateTimesheetEntryForm({ ...validBase, description: "" }).description
    ).toBe("Task description is required.")
    expect(
      validateTimesheetEntryForm({ ...validBase, description: "   " }).description
    ).toBe("Task description is required.")
  })

  it("accumulates multiple errors", () => {
    const errors = validateTimesheetEntryForm({
      ...validBase,
      project: "",
      workType: "",
      description: "",
    })
    expect(Object.keys(errors).length).toBe(3)
    expect(errors.project).toBeDefined()
    expect(errors.workType).toBeDefined()
    expect(errors.description).toBeDefined()
  })
})
