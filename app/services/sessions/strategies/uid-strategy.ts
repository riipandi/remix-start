import { parseFullName } from 'parse-full-name'
import invariant from 'tiny-invariant'

import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { generateUsernameFromEmail } from '@/modules/users/user.server'
import { UIDStrategy } from '@/services/sessions/strategies/uid-oauth'
// import { sendWelcomeEmail } from '@/services/mailer/welcome-email.server'
import { appUrl } from '@/utils/http'

// Validate envars value.
invariant(process.env.UID_CLIENT_ID, 'UID_CLIENT_ID must be set')
invariant(process.env.UID_CLIENT_SECRET, 'UID_CLIENT_SECRET must be set')

/**
 * Create a strategy for the UID authentication
 * See https://u.id/api-doc
 */

const scopes = ['user-read-email'].join(' ')

export const uidStrategy = new UIDStrategy(
  {
    clientID: process.env.UID_CLIENT_ID,
    clientSecret: process.env.UID_CLIENT_SECRET,
    callbackURL: appUrl(`/auth/uid/callback`),
    scope: scopes,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expiresAt = Date.now() + extraParams.expires_in * 1000
    const fullName = parseFullName(profile.displayName)
    const generatedUsername = await generateUsernameFromEmail(profile.emails[0].value)
    const username = profile.id || generatedUsername

    const socialAccount = {
      type: 'oauth',
      provider: profile.provider,
      providerAccountId: profile.id,
      refreshToken: refreshToken || null, // optional
      accessToken: accessToken, // optional
      expiresAt: expiresAt, // optional
      tokenType: extraParams.token_type, // optional
      // scopes: scopes, // optional
      // idToken: extraParams.id_token, // optional
      // sessionState: null, // optional
      // avatarUrl: profile.__json.images?.[0].url, // optional
    }

    const user = await createUserFromOAuth(
      {
        email: profile.emails[0].value,
        firstName: fullName.first,
        lastName: fullName.last,
        // avatarUrl: profile.__json.images?.[0].url,
        username,
      },
      socialAccount,
    )

    if (!user) throw new Error('Unable to create user.')

    // Send email notification to user
    // const loginLink = appUrl(`/auth/signin`)
    // await sendWelcomeEmail(user.email, user.firstName, loginLink)

    // Returns Auth Session from database.
    return { ...user }
  },
)
