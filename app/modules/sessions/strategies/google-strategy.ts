import invariant from 'tiny-invariant'
import { SocialsProvider } from 'remix-auth-socials'
import { GoogleStrategy } from 'remix-auth-socials'

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
    callbackURL: appUrl(`/auth/${SocialsProvider.GOOGLE}/callback`),
  },
  async ({ accessToken, refreshToken, profile }) => {
    const { _json: userProfile } = profile
    const user = await findUserByEmail(userProfile.email)

    const socialAccount = {
      providerAccountId: userProfile.sub,
      refreshToken: refreshToken || null,
      accessToken: accessToken,
      accountType: 'oauth',
      provider: 'google',
    }

    // If user exists but doesn't have a google account, create one
    if (user) {
      await createOrUpdateSocialConnection(userProfile.email, 'google', socialAccount)
    }

    if (!user) {
      const username = await generateUsernameFromEmail(userProfile.email)
      const userData = {
        email: userProfile.email,
        firstName: userProfile.given_name,
        lastName: userProfile.family_name,
        imageUrl: userProfile.picture,
        username,
      }
      const newUser = await createUserFromOAuth({ ...userData, ...socialAccount })

      // Send email notification to user
      // await sendEmail(newUser.email, 'Welcome to Stream Page', `Hello, ${userProfile.given_name}!`)

      return newUser
    }

    return user
  },
)
