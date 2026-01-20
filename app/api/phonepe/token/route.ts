import {  NextResponse } from 'next/server';
import axios from 'axios';

type TokenResponse = {
  access_token: string;
  token_type: string;
  expires_at?: number;
};

type ErrorResponse = { error: string };

export async function GET(): Promise<NextResponse<TokenResponse | ErrorResponse>> {
  const {
    PHONEPE_CLIENT_ID: clientId,
    PHONEPE_CLIENT_SECRET: clientSecret,
    PHONEPE_CLIENT_VERSION: clientVersion,
    PHONEPE_ENV: env,
  } = process.env;

  const isProd = env === 'production';
  const endpoint = isProd
    ? 'https://api.phonepe.com/apis/identity-manager/v1/oauth/token'
    : 'https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token';

  const params = new URLSearchParams({
    client_id: clientId ?? '',
    client_secret: clientSecret ?? '',
    client_version: clientVersion ?? '',
    grant_type: 'client_credentials',
  });

  // Debug logs
  console.debug('🛂 Fetching PhonePe token...');
  console.debug('Env:', env);
  console.debug('Endpoint:', endpoint);
  console.debug('Params:', params.toString());

  try {
    const resp = await axios.post(endpoint, params.toString(), {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const data = resp.data as TokenResponse;
    console.debug('✅ Token API response:', data);

    if (!data.access_token) {
      throw new Error('Missing access_token in token response');
    }

    return NextResponse.json({ access_token: data.access_token, token_type: data.token_type, expires_at: data.expires_at });
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error('❌ Axios error fetching token:', err.response?.data || err.message);
      const msg =
        typeof err.response?.data === 'object' && err.response?.data !== null && 'error' in err.response?.data
          ? (err.response?.data as { error: unknown }).error
          : err.message;
      return NextResponse.json({ error: String(msg) }, { status: err.response?.status ?? 500 });
    }

    console.error('❌ Unknown error fetching token:', err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
