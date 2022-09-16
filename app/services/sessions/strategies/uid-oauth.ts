import type { StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2Profile, OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import { OAuth2Strategy } from 'remix-auth-oauth2'

export interface UIDStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
  /**
   * @default "user-read-email"
   */
  scope?: string
}

export interface VerificationStatuses {
  nik: number
  email: number
  phone: number
  address: number
  presence: number
  percent: number
}

export interface UIDProfile extends OAuth2Profile {
  id: string
  displayName: string
  emails: [{ value: string }]
  photos?: [{ value: string }]
  __json: {
    user_id: string
    fullname: string
    email: string
    verification_statuses: Array<VerificationStatuses>
  }
}

export interface UIDExtraParams extends Record<string, string | number> {
  expires_in: number
  token_type: string
}

export class UIDStrategy<User> extends OAuth2Strategy<User, UIDProfile, UIDExtraParams> {
  public name = 'uid'
  private readonly scope: string
  private readonly userInfoURL = 'https://api-v2.u.id/api/v2/user_info'

  constructor(
    { clientID, clientSecret, callbackURL, scope }: UIDStrategyOptions,
    verify: StrategyVerifyCallback<User, OAuth2StrategyVerifyParams<UIDProfile, UIDExtraParams>>,
  ) {
    super(
      {
        clientID,
        clientSecret,
        callbackURL,
        authorizationURL: 'https://u.id/oauth/authorize',
        tokenURL: 'https://api-v2.u.id/api/oauth/token',
      },
      verify,
    )
    this.scope = scope ?? 'user-read-email'
  }

  protected authorizationParams(): URLSearchParams {
    const params = new URLSearchParams({ scope: this.scope })
    return params
  }

  protected async userProfile(access_token: string): Promise<UIDProfile> {
    const response = await fetch(this.userInfoURL, {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
    })

    const data: UIDProfile['__json'] = await response.json()

    const profile: UIDProfile = {
      provider: 'uid',
      displayName: data.fullname,
      id: data.user_id,
      emails: [{ value: data.email }],
      photos: undefined,
      __json: data,
    }

    return profile
  }

  protected async getAccessToken(response: Response): Promise<{
    accessToken: string
    refreshToken: string
    extraParams: UIDExtraParams
  }> {
    const { access_token, token_type, expires_in, refresh_token } = await response.json()

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      extraParams: { token_type, expires_in },
    } as const
  }
}
