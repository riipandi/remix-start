import invariant from 'tiny-invariant'
import { SpotifyStrategy } from 'remix-auth-spotify'
import { sessionStorage } from '@/modules/sessions/session.server'
import { parseFullName } from 'parse-full-name'

import { createOrUpdateSocialConnection, createUserFromOAuth } from '@/modules/users/oauth.server'
import { findUserByEmail, generateUsernameFromEmail } from '@/modules/users/user.server'
import { appUrl } from '@/utils/http'

// Validate envars value.
invariant(process.env.SPOTIFY_CLIENT_ID, 'SPOTIFY_CLIENT_ID must be set')
invariant(process.env.SPOTIFY_CLIENT_SECRET, 'SPOTIFY_CLIENT_SECRET must be set')

/**
 * Create a strategy for the Spotify authentication
 * See https://developer.spotify.com/documentation/general/guides/authorization/scopes
 */

const scopes = ['user-read-email'].join(' ')

export const spotifyStrategy = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: appUrl(`/auth/spotify/callback`),
    scope: scopes,
    sessionStorage,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const user = await findUserByEmail(profile.emails[0].value)
    const expiresAt = Date.now() + extraParams.expiresIn * 1000

    const socialAccount = {
      accountType: 'oauth',
      refreshToken: refreshToken || null,
      accessToken: accessToken,
      providerAccountId: profile.id,
      provider: profile.provider,
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
      await createOrUpdateSocialConnection(profile.emails[0].value, profile.provider, socialAccount)
    }

    if (!user) {
      const generatedUsername = await generateUsernameFromEmail(profile.emails[0].value)
      const username = profile.id || generatedUsername
      const fullName = parseFullName(profile.displayName)

      const newUser = await createUserFromOAuth({
        userData: {
          email: profile.emails[0].value,
          firstName: fullName.first,
          lastName: fullName.last,
          imageUrl: profile.__json.images?.[0].url,
          username,
        },
        ...socialAccount,
      })

      return { ...result, user: newUser }
    }

    // Taken from original sample.
    return { ...result, user }
  },
)
