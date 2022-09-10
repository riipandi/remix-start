import invariant from 'tiny-invariant'
import { GoogleStrategy } from 'remix-auth-google'

import { createOrUpdateSocialConnection } from '@/modules/users/oauth.server'
import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { findUserByEmail, generateUsernameFromEmail } from '@/modules/users/user.server'

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
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user = await findUserByEmail(profile.emails[0].value)
    const expiresAt = Date.now() + extraParams.expires_in * 1000

    const socialAccount = {
      accessToken: accessToken,
      accountType: 'oauth',
      provider: profile.provider,
      providerAccountId: profile._json.sub,
      refreshToken: refreshToken || null,
      tokenType: extraParams.tokenType,
      expiresAt,
    }

    const result = {
      accessToken,
      refreshToken,
      expiresAt,
      tokenType: extraParams.tokenType,
    }

    // If user exists but doesn't have a google account, create one
    if (user) {
      await createOrUpdateSocialConnection(profile._json.email, 'google', socialAccount)
    }

    if (!user) {
      const username = await generateUsernameFromEmail(profile._json.email)
      const userData = {
        email: profile._json.email,
        firstName: profile._json.given_name,
        lastName: profile._json.family_name,
        imageUrl: profile._json.picture,
        username,
      }
      const newUser = await createUserFromOAuth({ ...userData, ...socialAccount })

      // Send email notification to user
      // await sendEmail(newUser.email, 'Welcome to Stream Page', `Hello, ${profile._json.given_name}!`)

      return { ...result, user: newUser }
    }

    return { ...result, user }
  },
)
