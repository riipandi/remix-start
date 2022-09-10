import type { LoaderArgs, MetaFunction } from '@remix-run/node'
import { json } from '@remix-run/node'
import { Form, Link, NavLink, Outlet, useLoaderData } from '@remix-run/react'

import { LOGIN_URL } from '@/modules/sessions/constants.server'
import { getNoteListItems } from '@/modules/notes/note.server'
import { authenticator } from '@/modules/users/auth.server'
import { useUser } from '@/hooks/useUser'

export async function loader({ request }: LoaderArgs) {
  const { pathname } = new URL(request.url)
  let { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: `${LOGIN_URL}?redirectTo=${pathname}`,
  })

  const noteListItems = await getNoteListItems({ userId })

  return json({ noteListItems })
}

export const meta: MetaFunction = () => ({ title: 'Notes - Prismix' })

export default function NotesPage() {
  const data = useLoaderData<typeof loader>()
  const user = useUser()

  return (
    <div className="flex h-full min-h-screen flex-col">
      <header className="flex items-center justify-between bg-slate-800 p-4 text-white">
        <h1 className="text-3xl font-bold">
          <Link to=".">Notes</Link>
        </h1>
        <p>{user.email}</p>
        <Form action="/auth/signout" method="post">
          <button
            type="submit"
            className="rounded bg-slate-600 py-2 px-4 text-primary-100 hover:bg-primary-500 active:bg-primary-600"
          >
            Sign out
          </button>
        </Form>
      </header>

      <main className="flex h-full bg-white">
        <div className="h-full w-80 border-r bg-gray-50">
          <Link to="new" className="block p-4 text-xl text-primary-500">
            + New Note
          </Link>

          <hr />

          {data.noteListItems.length === 0 ? (
            <p className="p-4">No notes yet</p>
          ) : (
            <ol>
              {data.noteListItems.map((note) => (
                <li key={note.id}>
                  <NavLink
                    className={({ isActive }) => `block border-b p-4 text-xl ${isActive ? 'bg-white' : ''}`}
                    to={note.id}
                  >
                    📝 {note.title}
                  </NavLink>
                </li>
              ))}
            </ol>
          )}
        </div>

        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
