interface TimesheetTableEmptyRowProps {
  message?: string
  colSpan?: number
}

export default function TimesheetTableEmptyRow({
  message = "No data found.",
  colSpan = 4,
}: TimesheetTableEmptyRowProps) {
  return (
    <tr>
      <td colSpan={colSpan} className="py-12 text-center text-sm text-gray-400">
        {message}
      </td>
    </tr>
  )
}