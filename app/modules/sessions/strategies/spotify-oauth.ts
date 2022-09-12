import type { StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2Profile, OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import { OAuth2Strategy } from 'remix-auth-oauth2'

export interface SpotifyStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  /**
   * @default "user-read-email"
   */
  scope?: string
}

export interface SpotifyImage {
  url: string
  height: number | null
  width: number | null
}

export interface SpotifyProfile extends OAuth2Profile {
  id: string
  displayName: string
  emails: [{ value: string }]
  photos?: [{ value: string }]
  __json: {
    id: string
    display_name: string
    email: string
    country: string
    explicit_content: {
      filter_enabled: boolean
      filter_locked: boolean
    }
    external_urls: {
      spotify: string
    }
    followers: {
      href: string | null
      total: number
    }
    href: string
    images: Array<SpotifyImage>
    product: string
    type: string
    uri: string
  }
}

export interface SpotifyExtraParams extends Record<string, string | number> {
  expiresIn: number
  tokenType: string
}

export class SpotifyStrategy<User> extends OAuth2Strategy<User, SpotifyProfile, SpotifyExtraParams> {
  public name = 'spotify'
  private readonly scope: string
  private readonly userInfoURL = 'https://api.spotify.com/v1/me'

  constructor(
    { clientID, clientSecret, callbackURL, scope }: SpotifyStrategyOptions,
    verify: StrategyVerifyCallback<User, OAuth2StrategyVerifyParams<SpotifyProfile, SpotifyExtraParams>>,
  ) {
    super(
      {
        clientID,
        clientSecret,
        callbackURL,
        authorizationURL: 'https://accounts.spotify.com/authorize',
        tokenURL: 'https://accounts.spotify.com/api/token',
      },
      verify,
    )
    this.scope = scope ?? 'user-read-email'
  }

  protected authorizationParams(): URLSearchParams {
    const params = new URLSearchParams({ scope: this.scope })
    return params
  }

  protected async userProfile(accessToken: string): Promise<SpotifyProfile> {
    const response = await fetch(this.userInfoURL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const data: SpotifyProfile['__json'] = await response.json()

    const profile: SpotifyProfile = {
      provider: 'spotify',
      displayName: data.display_name,
      id: data.id,
      emails: [{ value: data.email }],
      photos: data.images.length > 0 ? [{ value: data.images[0].url }] : undefined,
      __json: data,
    }

    return profile
  }

  protected async getAccessToken(response: Response): Promise<{
    accessToken: string
    refreshToken: string
    extraParams: SpotifyExtraParams
  }> {
    const {
      access_token: accessToken,
      token_type: tokenType,
      expires_in: expiresIn,
      refresh_token: refreshToken,
    } = await response.json()

    return {
      accessToken,
      refreshToken,
      extraParams: { tokenType, expiresIn },
    } as const
  }
}
