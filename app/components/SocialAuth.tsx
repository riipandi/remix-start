import type { FC } from 'react'
import { Form } from '@remix-run/react'

interface SocialButtonProps {
  provider: 'google' | 'spotify'
  label: string
  className?: string
}

const SocialButton: React.FC<SocialButtonProps> = ({ provider, label, className }) => (
  <Form action={`/auth/${provider}`} method="post" className={className}>
    <button className="mb-6 inline-flex w-full items-center justify-center rounded-md border border-gray-100 bg-white py-3 px-7 text-center text-base text-gray-500 shadow-sm hover:border-gray-200">
      <img
        className="mr-2 h-4"
        src="https://shuffle.dev/flex-ui-assets/elements/sign-up/google-icon-sign-up.svg"
        alt=""
      />
      <span>{label}</span>
      <span className="pl-1 capitalize">{provider}</span>
    </button>
  </Form>
)

export enum AuthLabel {
  SIGNIN = 'Sign in with',
  SIGNUP = 'Continue with',
}

export const SocialAuth: FC<{ label: AuthLabel }> = ({ label }) => {
  return (
    <>
      <SocialButton provider="google" label={label} />
      <SocialButton provider="spotify" label={label} />
    </>
  )
}
