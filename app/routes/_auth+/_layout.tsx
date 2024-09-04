import { Outlet } from '@remix-run/react'

export default function AuthLayout() {
  return (
    <div className="flex h-full min-h-screen items-center bg-gray-50 dark:bg-gray-950">
      <Outlet />
    </div>
  )
}
