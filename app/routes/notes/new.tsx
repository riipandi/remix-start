import type { ActionArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { Form, useSubmit } from '@remix-run/react'
import { useForm } from 'react-hook-form'

import { LOGIN_URL } from '@/services/sessions/constants.server'
import { authenticator } from '@/modules/users/auth.server'
import { createNote } from '@/modules/notes/note.server'

export async function action({ request }: ActionArgs) {
  const { pathname } = new URL(request.url)
  let { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: `${LOGIN_URL}?redirectTo=${pathname}`,
  })

  const formData: any = await request.formData()
  const note = await createNote({
    title: formData.get('title'),
    body: formData.get('body'),
    summary: formData.get('summary'),
    userId,
  })

  return redirect(`/notes/${note.id}`)
}

export const meta: MetaFunction = () => ({ title: 'New Note - Prismix' })

export default function NewNotePage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const submit = useSubmit()

  const onSubmit = (data: any) => submit(data, { method: 'post' })

  return (
    <Form method="post" reloadDocument className="flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Title: </span>
          <input
            {...register('title', { required: true })}
            className="flex-1 rounded-md border-2 border-primary-500 px-3 text-lg leading-loose"
            aria-invalid={errors.title ? true : undefined}
            aria-errormessage={errors.title ? 'title-error' : undefined}
          />
        </label>
        {errors.title && (
          <span className="pt-1 text-red-700" id="title-error">
            Title is required
          </span>
        )}
      </div>
      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Summary: </span>
          <input
            {...register('summary', { required: true })}
            className="flex-1 rounded-md border-2 border-primary-500 px-3 text-lg leading-loose"
            aria-invalid={errors.summary ? true : undefined}
            aria-errormessage={errors.summary ? 'summary-error' : undefined}
          />
        </label>
        {errors.summary && (
          <span className="pt-1 text-red-700" id="summary-error">
            This field is required
          </span>
        )}
      </div>

      <div>
        <label className="flex w-full flex-col gap-1">
          <span>Body: </span>
          <textarea
            rows={8}
            {...register('body', { required: true })}
            className="w-full flex-1 rounded-md border-2 border-primary-500 py-2 px-3 text-lg leading-6"
            aria-invalid={errors.body ? true : undefined}
            aria-errormessage={errors.body ? 'body-error' : undefined}
          />
        </label>
        {errors.body && (
          <span className="pt-1 text-red-700" id="body-error">
            This field is required
          </span>
        )}
      </div>

      <div className="text-right">
        <button
          type="submit"
          className="rounded bg-primary-500 py-2 px-4 text-white hover:bg-primary-600 focus:bg-primary-400"
        >
          Save
        </button>
      </div>
    </Form>
  )
}
