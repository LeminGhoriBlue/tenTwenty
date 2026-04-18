import { useSession, signIn, signOut } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()

  const login = async (email: string, password: string) => {
    const result = await signIn("credentials", { email, password, redirect: false })
    if (result?.error) return { success: false, message: "Invalid email or password." }
    window.location.replace("/dashboard")
    return { success: true, message: "" }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    window.location.replace("/login")
  }

  return {
    user: session?.user,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    login,
    logout,
  }
}