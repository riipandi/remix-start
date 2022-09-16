import { parseFullName } from 'parse-full-name'
import invariant from 'tiny-invariant'

import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { generateUsernameFromEmail } from '@/modules/users/user.server'
import { UdotIdStrategy } from '@/services/sessions/strategies/udotid-oauth'
import { appUrl } from '@/utils/http'

// Validate envars value.
invariant(process.env.UID_CLIENT_ID, 'UID_CLIENT_ID must be set')
invariant(process.env.UID_CLIENT_SECRET, 'UID_CLIENT_SECRET must be set')

/**
 * Create a strategy for the UID authentication
 * See https://u.id/api-doc
 */

export const udotidStrategy = new UdotIdStrategy(
  {
    clientID: process.env.UID_CLIENT_ID,
    clientSecret: process.env.UID_CLIENT_SECRET,
    callbackURL: appUrl(`/auth/udotid/callback`),
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expiresAt = Date.now() + extraParams.expires_in * 1000
    const fullName = parseFullName(profile.displayName)
    const username = await generateUsernameFromEmail(profile.emails[0].value)
    const avatarUrl = null

    const socialAccount = {
      type: 'oauth',
      provider: profile.provider,
      providerAccountId: profile.id,
      refreshToken: refreshToken || null, // optional
      accessToken: accessToken, // optional
      expiresAt: expiresAt, // optional
      tokenType: extraParams.token_type, // optional
      // scopes: null, // optional
      // idToken: null, // optional
      // sessionState: null, // optional
      // avatarUrl, // optional
    }

    const user = await createUserFromOAuth(
      {
        email: profile.emails[0].value,
        firstName: fullName.first,
        lastName: fullName.last,
        avatarUrl,
        username,
      },
      socialAccount,
    )

    if (!user) throw new Error('Unable to create user.')

    // Returns Auth Session from database.
    return { ...user }
  },
)
