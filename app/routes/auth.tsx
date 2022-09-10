import { Outlet } from '@remix-run/react'

export default function Auth() {
  return (
    <div className="flex min-h-full flex-col justify-center bg-gray-50">
      <Outlet />
    </div>
  )
}
