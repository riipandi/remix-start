import { parseFullName } from 'parse-full-name'
import invariant from 'tiny-invariant'

import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { generateUsernameFromEmail } from '@/modules/users/user.server'
import { SpotifyStrategy } from '@/services/sessions/strategies/spotify-oauth'
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
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => {
    const expiresAt = Date.now() + extraParams.expiresIn * 1000
    const fullName = parseFullName(profile.displayName)
    const generatedUsername = await generateUsernameFromEmail(profile.emails[0].value)
    const username = profile.id || generatedUsername
    const avatarUrl = profile.__json.images?.[0].url

    const socialAccount = {
      type: 'oauth',
      provider: profile.provider,
      providerAccountId: profile.id,
      refreshToken: refreshToken || null, // optional
      accessToken: accessToken, // optional
      expiresAt: expiresAt, // optional
      tokenType: extraParams.tokenType, // optional
      scopes: scopes, // optional
      idToken: extraParams.id_token, // optional
      sessionState: null, // optional
      avatarUrl, // optional
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
