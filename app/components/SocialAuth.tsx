import type { FC } from 'react'
import { Form } from '@remix-run/react'

import { GoogleIcon } from './SocialIcons/GoogleIcon'
import { SpotifyIcon } from './SocialIcons/SpotifyIcon'

interface SocialButtonProps {
  provider: 'google' | 'spotify'
  label: string
  className?: string
  icon: any
}

const SocialButton: React.FC<SocialButtonProps> = (props) => {
  const { provider, label, className, icon } = props
  return (
    <Form action={`/auth/${provider}`} method="post" className={className}>
      <button className="mb-6 inline-flex w-full items-center justify-center rounded-md border border-gray-100 bg-white py-3 px-7 text-center text-base text-gray-500 shadow-sm hover:border-gray-200">
        {icon}
        <span>{label}</span>
        <span className="pl-1 capitalize">{provider}</span>
      </button>
    </Form>
  )
}

export enum AuthLabel {
  SIGNIN = 'Sign in with',
  SIGNUP = 'Continue with',
}

export const SocialAuth: FC<{ label: AuthLabel }> = ({ label }) => {
  return (
    <>
      <SocialButton provider="google" label={label} icon={<GoogleIcon className="mr-2 -ml-1 h-4 w-4" />} />
      <SocialButton provider="spotify" label={label} icon={<SpotifyIcon className="mr-2 -ml-1 h-4 w-4" />} />
    </>
  )
}
