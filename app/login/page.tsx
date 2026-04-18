"use client"

import ValidatedFormField from "@/components/ui/ValidatedFormField"
import { useAuth } from "@/hooks/useAuth"
import { useState } from "react"

interface FormState {
    email: string
    password: string
    rememberMe: boolean
}

interface FormErrors {
    email?: string
    password?: string
}

function validate(form: FormState): FormErrors {
    const errors: FormErrors = {}

    if (!form.email.trim()) {
        errors.email = "Email is required."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = "Enter a valid email address."
    }

    if (!form.password) {
        errors.password = "Password is required."
    } else if (form.password.length < 6) {
        errors.password = "Must be at least 6 characters."
    }

    return errors
}

export default function SignInPage() {
    const { login, isLoading } = useAuth()
    const [apiError, setApiError] = useState("")
    const [form, setForm] = useState<FormState>({
        email: "",
        password: "",
        rememberMe: false,
    })
    const [errors, setErrors] = useState<FormErrors>({})

    function handleChange(field: keyof FormState, value: string | boolean) {
        setForm((prev) => ({ ...prev, [field]: value }))
        setErrors((prev) => ({ ...prev, [field]: undefined }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        const validationErrors = validate(form)
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors)
            return
        }
        const result = await login(form.email, form.password)
        if (!result.success) setApiError(result.message)
    }

    return (
        <div className="flex h-screen w-full">

            <div className="flex w-full flex-col justify-center px-10 md:w-1/2">
                <div className="mx-auto w-full max-w-sm">
                    <h1 className="mb-8 text-2xl font-semibold text-gray-900">
                        Welcome back
                    </h1>

                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                        <ValidatedFormField
                            id="email"
                            label="Email"
                            type="email"
                            placeholder="name@example.com"
                            value={form.email}
                            error={errors.email}
                            onChange={(val) => handleChange("email", val)}
                        />

                        <ValidatedFormField
                            id="password"
                            label="Password"
                            type="password"
                            placeholder="••••••••••"
                            value={form.password}
                            error={errors.password}
                            onChange={(val) => handleChange("password", val)}
                        />

                        <div className="flex items-center gap-2">
                            <input
                                id="rememberMe"
                                type="checkbox"
                                checked={form.rememberMe}
                                onChange={(e) => handleChange("rememberMe", e.target.checked)}
                                className="h-4 w-4 rounded accent-primary"
                            />
                            <label htmlFor="rememberMe" className="text-sm text-gray-600 cursor-pointer">
                                Remember me
                            </label>
                        </div>

                        {apiError && (
                            <p role="alert" className="rounded bg-red-50 px-3 py-2 text-sm text-red-600">
                                {apiError}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full rounded-md bg-primary py-2 text-sm font-medium text-white transition hover:opacity-90 active:opacity-80 disabled:opacity-60"
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </button>

                    </form>
                </div>
            </div>

            <div className="hidden md:flex md:w-1/2 flex-col justify-center bg-primary px-14">
                <div className="w-full">
                    <h2 className="mb-4 text-4xl font-bold text-white">ticktock</h2>
                    <p className="text-sm leading-relaxed text-blue-100">
                        Introducing ticktock, our cutting-edge timesheet web application
                        designed to revolutionize how you manage employee work hours. With
                        ticktock, you can effortlessly track and monitor employee attendance
                        and productivity from anywhere, anytime, using any
                        internet-connected device.
                    </p>
                </div>
            </div>

        </div>
    )
}