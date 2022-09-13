import invariant from 'tiny-invariant'
import { parseFullName } from 'parse-full-name'

import { createUserFromOAuth } from '@/modules/users/oauth.server'
import { SpotifyStrategy } from '@/services/sessions/strategies/spotify-oauth'
import { generateUsernameFromEmail } from '@/modules/users/user.server'
// import { sendWelcomeEmail } from '@/services/mailer/welcome-email.server'
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
      avatarUrl: profile.__json.images?.[0].url, // optional
    }

    const user = await createUserFromOAuth(
      {
        email: profile.emails[0].value,
        firstName: fullName.first,
        lastName: fullName.last,
        avatarUrl: profile.__json.images?.[0].url,
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
