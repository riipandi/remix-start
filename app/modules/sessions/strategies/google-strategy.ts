import invariant from 'tiny-invariant'
import { GoogleStrategy } from 'remix-auth-google'

import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { generateUsernameFromEmail } from '@/modules/users/user.server'
import { appUrl } from '@/utils/http'

// Validate envars value.
invariant(process.env.GOOGLE_CLIENT_ID, 'GOOGLE_CLIENT_ID must be set')
invariant(process.env.GOOGLE_CLIENT_SECRET, 'GOOGLE_CLIENT_SECRET must be set')

/**
 * Create a strategy for the google authentication
 */
export const googleStrategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: appUrl(`/auth/google/callback`),
    // prompt: 'consent',
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expiresAt = Date.now() + extraParams.expires_in * 1000
    const username = await generateUsernameFromEmail(profile._json.email)

    const socialAccount = {
      type: 'oauth',
      provider: profile.provider,
      providerAccountId: profile._json.sub,
      refreshToken: refreshToken || null, // optional
      accessToken: accessToken, // optional
      expiresAt: expiresAt, // optional
      tokenType: extraParams.token_type, // optional
      scopes: extraParams.scope, // optional
      idToken: extraParams.id_token, // optional
      sessionState: null, // optional
      avatarUrl: profile._json.picture, // optional
    }

    const user = await createUserFromOAuth(
      {
        email: profile._json.email,
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        avatarUrl: profile._json.picture,
        username,
      },
      socialAccount,
    )

    if (!user) throw new Error('Unable to create user.')

    // Send email notification to user
    // await sendEmail(newUser.email, 'Welcome to Prismix', `Hello, ${profile._json.given_name}!`)

    // Returns Auth Session from database.
    return { ...user }
  },
)
