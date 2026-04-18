interface ValidatedFormFieldProps {
    id: string
    label: string
    type?: string
    placeholder?: string
    value: string | number
    error?: string
    options?: { label: string; value: string }[]
    hint?: string
    required?: boolean
    onChange: (value: string) => void
}

export default function ValidatedFormField({
    id,
    label,
    type = "text",
    placeholder,
    value,
    error,
    options = [],
    hint,
    required,
    onChange,
}: ValidatedFormFieldProps) {
    const baseInput = `w-full rounded-md border px-3 py-2 text-sm outline-none transition
    focus:ring-2 focus:ring-primary/30 focus:border-primary
    ${error ? "border-red-400" : "border-input"}`

    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="text-sm font-medium text-gray-700">
                {label} {required && <span className="text-red-500">*</span>}
            </label>

            {type === "textarea" && (
                <textarea
                    id={id}
                    placeholder={placeholder}
                    value={value}
                    rows={4}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInput}
                />
            )}

            {type === "select" && (
                <select
                    id={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInput}
                >
                    <option value="" disabled>
                        {placeholder}
                    </option>
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            )}

            {!["textarea", "select"].includes(type) && (
                <input
                    id={id}
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInput}
                />
            )}

            {hint && !error && (
                <p className="text-xs text-gray-400">{hint}</p>
            )}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}