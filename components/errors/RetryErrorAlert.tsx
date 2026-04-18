interface RetryErrorAlertProps {
  message?: string
  onRetry?: () => void
}

export default function RetryErrorAlert({
  message = "Something went wrong.",
  onRetry,
}: RetryErrorAlertProps) {
  return (
    <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-6 text-center">
      <p className="text-sm font-medium text-red-600">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white hover:opacity-90 transition-opacity"
        >
          Try again
        </button>
      )}
    </div>
  )
}