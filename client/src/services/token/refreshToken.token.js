
import axios from "axios";

export async function refreshToken() {
  try {
    const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL_AUTH || "http://localhost:5000";

    const res = await axios.get(`${BASE_URL}/api/auth/refresh`, {
      withCredentials: true,
    });

    console.log("New access token obtained via refresh" , res.data);

    return res.data?.accessToken || null;
  } catch (err) {
    console.log("Refresh token expired or invalid");
    return null;
  }
}
