import { Outlet } from '@remix-run/react'

export default function Auth() {
  return (
    <div className="h-full min-h-screen bg-slate-50">
      <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          {/* <div className="mb-5">
            <Link to="/" className="flex flex-1" tabIndex={-1}>
              <LogoGram variant="positive-blue" className="mx-auto h-16 sm:h-20 w-auto" />
            </Link>
          </div> */}
          <Outlet />
        </div>
      </div>
    </div>
  )
}
