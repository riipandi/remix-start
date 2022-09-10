import invariant from 'tiny-invariant'
import { SpotifyStrategy } from 'remix-auth-spotify'
import { sessionStorage } from '@/modules/sessions/session.server'
import { appUrl } from '@/utils/http'

// Validate envars value.
invariant(process.env.SPOTIFY_CLIENT_ID, 'SPOTIFY_CLIENT_ID must be set')
invariant(process.env.SPOTIFY_CLIENT_SECRET, 'SPOTIFY_CLIENT_SECRET must be set')

// -------------------------------------------------------------------------------------------------
// Create a strategy for the Spotify authentication
// See https://developer.spotify.com/documentation/general/guides/authorization/scopes
// -------------------------------------------------------------------------------------------------

const scopes = ['user-read-email'].join(' ')

export const spotifyStrategy = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    callbackURL: appUrl(`/auth/spotify/callback`),
    scope: scopes,
    sessionStorage,
  },
  async ({ accessToken, refreshToken, extraParams, profile }) => ({
    accessToken,
    refreshToken,
    expiresAt: Date.now() + extraParams.expiresIn * 1000,
    tokenType: extraParams.tokenType,
    user: {
      id: profile.id,
      email: profile.emails[0].value,
      name: profile.displayName,
      image: profile.__json.images?.[0].url,
    },
  }),
)
