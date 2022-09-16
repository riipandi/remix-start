import type { FC } from 'react'
import { Form } from '@remix-run/react'

import { GoogleIcon } from './SocialIcons/GoogleIcon'
import { SpotifyIcon } from './SocialIcons/SpotifyIcon'
// import { UIDIcon } from './SocialIcons/UIDIcon'

interface SocialButtonProps {
  provider: 'google' | 'spotify' | 'udotid'
  label: string
  className?: string
  icon: any
}

const SocialButton: React.FC<SocialButtonProps> = (props) => {
  const { provider, label, className, icon } = props
  const providerLabel = provider === 'udotid' ? 'U.ID' : provider
  return (
    <Form action={`/auth/${provider}`} method="post" className={className}>
      <button className="inline-flex w-full items-center justify-center rounded-md border border-gray-200 bg-white py-2.5 px-6 text-center hover:bg-gray-50 text-sm text-gray-600 shadow-sm hover:border-gray-300">
        {icon}
        <span className="pl-1 capitalize">{`${label} ${providerLabel}`}</span>
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
    <div className="space-y-2">
      <SocialButton provider="google" label={label} icon={<GoogleIcon className="mr-2 -ml-1 h-4 w-4" />} />
      <SocialButton provider="spotify" label={label} icon={<SpotifyIcon className="mr-2 -ml-1 h-4 w-4" />} />
      {/* <SocialButton provider="udotid" label={label} icon={<UIDIcon className="mr-2 -ml-1 h-3 w-auto" />} /> */}
    </div>
  )
}
