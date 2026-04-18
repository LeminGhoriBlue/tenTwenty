export interface TimesheetEntryFormState {
  project: string
  workType: string
  description: string
  hours: number
}

export interface TimesheetEntryFormErrors {
  project?: string
  workType?: string
  description?: string
}

export function validateTimesheetEntryForm(
  form: TimesheetEntryFormState
): TimesheetEntryFormErrors {
  const errors: TimesheetEntryFormErrors = {}
  if (!form.project) errors.project = "Project is required."
  if (!form.workType) errors.workType = "Type of work is required."
  if (!form.description.trim())
    errors.description = "Task description is required."
  return errors
}
