import type { ReactNode } from "react"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../hooks"

export default function ProtectedRoute({ children }: { children?: ReactNode } = {}) {
  const { bootstrapped, user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!bootstrapped) return <p className="loading">Opening your notebook…</p>
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return children ? <>{children}</> : <Outlet />
}
