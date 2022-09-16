import type { StrategyVerifyCallback } from 'remix-auth'
import type { OAuth2Profile, OAuth2StrategyVerifyParams } from 'remix-auth-oauth2'
import { OAuth2Strategy } from 'remix-auth-oauth2'

export interface UdotIdStrategyOptions {
  clientID: string
  clientSecret: string
  callbackURL: string
}

export interface VerificationStatuses {
  nik: number
  email: number
  phone: number
  address: number
  presence: number
  percent: number
}

export interface UdotIdProfile extends OAuth2Profile {
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

export interface UdotIdExtraParams extends Record<string, string | number> {
  expires_in: number
  token_type: string
}

export class UdotIdStrategy<User> extends OAuth2Strategy<User, UdotIdProfile, UdotIdExtraParams> {
  public name = 'udotid'
  private readonly userInfoURL = 'https://api-v2.u.id/api/v2/user_info'

  constructor(
    { clientID, clientSecret, callbackURL }: UdotIdStrategyOptions,
    verify: StrategyVerifyCallback<User, OAuth2StrategyVerifyParams<UdotIdProfile, UdotIdExtraParams>>,
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
  }

  protected authorizationParams(): URLSearchParams {
    const urlSearchParams: Record<string, string> = {
      response_type: 'code',
    }
    return new URLSearchParams(urlSearchParams)
  }

  protected async userProfile(accessToken: string): Promise<UdotIdProfile> {
    const response = await fetch(this.userInfoURL, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })

    const result = await response.json()
    const data: UdotIdProfile['__json'] = result.data

    const profile: UdotIdProfile = {
      provider: 'udotid',
      id: data.user_id,
      displayName: data.fullname,
      emails: [{ value: data.email }],
      photos: undefined,
      __json: data,
    }

    return profile
  }

  protected async getAccessToken(response: Response): Promise<{
    accessToken: string
    refreshToken: string
    extraParams: UdotIdExtraParams
  }> {
    const { access_token, token_type, expires_in, refresh_token } = await response.json()

    return {
      accessToken: access_token,
      refreshToken: refresh_token,
      extraParams: { token_type, expires_in },
    } as const
  }
}
