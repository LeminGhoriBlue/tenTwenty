"use client"

import { useState } from "react"
import { X, Minus, Plus } from "lucide-react"
import ValidatedFormField from "@/components/ui/ValidatedFormField"
import type { TimesheetEntry } from "@/lib/types"
import { validateTimesheetEntryForm } from "@/lib/timesheetEntryFormValidation"

interface TimesheetEntryModalProps {
  open: boolean
  entry: TimesheetEntry | null
  onClose: () => void
  onSubmit: (payload: Partial<TimesheetEntry>) => void
}

interface FormState {
  project: string
  workType: string
  description: string
  hours: number
}

const PROJECT_OPTIONS = [
  { label: "Ticktock", value: "Ticktock" },
  { label: "Internal", value: "Internal" },
  { label: "Other", value: "Other" },
]

const WORK_TYPE_OPTIONS = [
  { label: "Feature", value: "Feature" },
  { label: "Bug fixes", value: "Bug fixes" },
  { label: "Code Review", value: "Code Review" },
  { label: "Testing", value: "Testing" },
]

function buildInitialForm(entry: TimesheetEntry | null): FormState {
  if (entry) {
    return {
      project: entry.project,
      workType: entry.workType,
      description: entry.description,
      hours: entry.hours,
    }
  }
  return { project: "", workType: "Bug fixes", description: "", hours: 12 }
}

/** Remount via `key` from the parent when `entry` or add-vs-edit context changes so initial state stays in sync without an effect. */
export default function TimesheetEntryModal({ open, entry, onClose, onSubmit }: TimesheetEntryModalProps) {
  const [form, setForm] = useState<FormState>(() => buildInitialForm(entry))
  const [errors, setErrors] = useState<
    ReturnType<typeof validateTimesheetEntryForm>
  >({})

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function handleSubmit() {
    const validationErrors = validateTimesheetEntryForm(form)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    onSubmit({ ...form, hours: Number(form.hours) })
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            {entry ? "Edit Entry" : "Add New Entry"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4">
          <ValidatedFormField
            id="project"
            label="Select Project"
            type="select"
            placeholder="Project Name"
            value={form.project}
            error={errors.project}
            options={PROJECT_OPTIONS}
            required
            onChange={(val) => handleChange("project", val)}
          />

          <ValidatedFormField
            id="workType"
            label="Type of Work"
            type="select"
            placeholder="Select type"
            value={form.workType}
            error={errors.workType}
            options={WORK_TYPE_OPTIONS}
            required
            onChange={(val) => handleChange("workType", val)}
          />

          <ValidatedFormField
            id="description"
            label="Task description"
            type="textarea"
            placeholder="Write text here ..."
            value={form.description}
            error={errors.description}
            hint="A note for extra info"
            required
            onChange={(val) => handleChange("description", val)}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">
              Hours <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm((p) => ({ ...p, hours: Math.max(1, p.hours - 1) }))}
                className="flex h-7 w-7 items-center justify-center rounded border border-border text-gray-600 hover:bg-gray-50"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center text-sm font-medium text-gray-900">
                {form.hours}
              </span>
              <button
                onClick={() => setForm((p) => ({ ...p, hours: Math.min(24, p.hours + 1) }))}
                className="flex h-7 w-7 items-center justify-center rounded border border-border text-gray-600 hover:bg-gray-50"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-1 rounded-md bg-primary py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
          >
            {entry ? "Save changes" : "Add entry"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-md border border-border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}