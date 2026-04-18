export interface User {
  id: string
  name: string
  email: string
}

export interface Week {
  id: string
  weekNumber: number
  startDate: string
  endDate: string
  status: string
}

export interface TimesheetEntry {
  id: string
  weekId: string
  date: string
  hours: number
  description: string
  project: string
  workType: string
}

export interface ApiError {
  message: string
}