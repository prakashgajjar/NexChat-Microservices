// /services/ui.service.js

import axios from "axios";
import { refreshToken } from "../token/refreshToken.token.js";

export async function updateTheme(theme) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/cookies/theme/set`,
      {
        method: "POST",
        credentials: "include", // include cookies
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ theme }),
      }
    );

    const data = await res.json();

    if (data?.status == 401) {
      await refreshToken();
    }
    return data;
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function getTheme() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/ui/theme`,
      {
        method: "GET",
        credentials: "include", // read cookies
      }
    );

    const data = res.json();
    if (data?.status == 401) {
      await refreshToken();
    }

    return await data;
  } catch (error) {
    console.error("Error fetching theme:", error);
    return { success: false };
  }
}

export const updateChatBgUrl = async (chatBgUrl) => {
  if (!chatBgUrl) {
    throw new Error("chatBgUrl is required");
  }

  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/profile/bg/update`,
      { chatBgUrl },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response?.status == 401) {
      console.log("response from refresh token", response);
      await refreshToken();
    }

    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      error.message ||
      "Failed to update chat background";

    throw new Error(message);
  }
};
