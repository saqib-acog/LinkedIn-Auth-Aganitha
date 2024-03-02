import axios from "axios";

export async function getUserInfo(accessToken) {
  const user_info_url = `https://api.linkedin.com/v2/userinfo`;
  let userInfo;

  let retryCount = 0;
  const maxRetries = 5;
  while (!userInfo && retryCount < maxRetries) {
    try {
      const userInfoResponse = await axios.get(user_info_url, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      userInfo = userInfoResponse.data;
    } catch (error) {
      if (error.code === "ETIMEDOUT") {
        console.error("Request timed out. Retrying...");
      } else {
        console.error("Error from LinkedIn API:", error);
        return res.redirect("/");
      }
    }
    retryCount++;
  }

  if (!userInfo) {
    console.error("Maximum retries reached. Unable to fetch user information.");
    return res.redirect("/");
  }
  return userInfo;
}
