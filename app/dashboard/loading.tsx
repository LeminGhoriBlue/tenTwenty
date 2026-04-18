export default function TimesheetsOverviewLoading() {
  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-5 h-7 w-48 animate-pulse rounded bg-gray-100" />
      <div className="mb-5 flex gap-3">
        <div className="h-8 w-32 animate-pulse rounded bg-gray-100" />
        <div className="h-8 w-32 animate-pulse rounded bg-gray-100" />
      </div>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-5 w-10 animate-pulse rounded bg-gray-100" />
            <div className="h-5 w-56 animate-pulse rounded bg-gray-100" />
            <div className="h-6 w-24 animate-pulse rounded bg-gray-100" />
            <div className="ml-auto h-5 w-12 animate-pulse rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  )
}