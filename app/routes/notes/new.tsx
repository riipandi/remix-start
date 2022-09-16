import type { ActionArgs, MetaFunction } from '@remix-run/node'
import { redirect } from '@remix-run/node'
import { withZod } from '@remix-validated-form/with-zod'
import { ValidatedForm, validationError } from 'remix-validated-form'
import { z } from 'zod'

import { createNote } from '@/modules/notes/note.server'
import { authenticator } from '@/modules/users/auth.server'
import { LOGIN_URL } from '@/services/sessions/constants.server'

import { SubmitButton } from '@/components/Buttons'
import { TextArea, TextInput } from '@/components/Input'

export const validator = withZod(
  z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    summary: z.string().min(1, { message: 'Summary is required' }),
    body: z.string().min(1, { message: 'Body is required' }),
  }),
)

export async function action({ request }: ActionArgs) {
  const { pathname } = new URL(request.url)
  let { id: userId } = await authenticator.isAuthenticated(request, {
    failureRedirect: `${LOGIN_URL}?redirectTo=${pathname}`,
  })

  // Validate the forms before submitted
  const fieldValues = await validator.validate(await request.formData())
  if (fieldValues.error) return validationError(fieldValues.error)

  // Do something with correctly typed values
  const { title, summary, body } = fieldValues.data
  const note = await createNote({ title, body, summary, userId })

  return redirect(`/notes/${note.id}`)
}

export const meta: MetaFunction = () => ({ title: 'New Note - Prismix' })

export default function NewNotePage() {
  return (
    <div>
      <ValidatedForm
        method="post"
        validator={validator}
        className="flex flex-col gap-4 w-full"
        autoComplete="off"
        id="signin-form"
      >
        <div>
          <TextInput name="title" label="Title" />
        </div>
        <div>
          <TextInput name="summary" label="Summary" />
        </div>

        <div>
          <TextArea name="body" label="Body" />
        </div>

        <div className="flex sm:justify-end">
          <div className="w-full sm:w-44">
            <SubmitButton label="Submit" submitLabel="Processing..." />
          </div>
        </div>
      </ValidatedForm>
    </div>
  )
}
