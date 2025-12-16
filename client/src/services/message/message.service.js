import axios from "axios";
import { refreshToken } from "../token/refreshToken.token.js";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL_MESSAGES || "http://localhost:5002";

export async function sendMessage(payload) {
  try {
    const res = await axios.post(`${API_BASE}/api/message/send`, payload, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    if (res.status == 401) {
      await refreshToken();
    }

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
}

export async function getMessages(receiverId) {
  try {
    const res = await axios.get(`${API_BASE}/api/message/get/${receiverId}`, {
      withCredentials: true,
    });

    if (res.status == 401) {
      await refreshToken();
    }

    if (!res.data.success) throw new Error(res.data.message);

    return res.data.data;
  } catch (err) {
    console.error("getMessages error:", err);
    throw err;
  }
}
