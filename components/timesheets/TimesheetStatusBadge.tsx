import { memo } from "react"

const statusStyles: Record<string, string> = {
  Completed: "bg-[#DEF7EC] text-[#03543F]",
  Overtime: "bg-[#FEECDC] text-[#B43403]",
  Incomplete: "bg-[#FDF6B2] text-[#723B13]",
  Missing: "bg-[#FCE8F3] text-[#99154B]",
}

function TimesheetStatusBadge({ status }: { status: string }) {
  const style = statusStyles[status] ?? "bg-gray-100 text-gray-600"
  return (
    <span className={`inline-block rounded px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${style}`}>
      {status}
    </span>
  )
}

export default memo(TimesheetStatusBadge)