import axios from "axios";

export async function getAccessToken(code, redirectUri) {
  const client_id = process.env.LINKEDIN_CLIENT_ID;
  const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
  const access_token_url = `https://www.linkedin.com/oauth/v2/accessToken?grant_type=authorization_code&code=${code}&redirect_uri=${redirectUri}&client_id=${client_id}&client_secret=${client_secret}`;

  const accessTokenResponse = await axios.post(access_token_url);
  const accessToken = accessTokenResponse.data.access_token;
  return accessToken;
}
