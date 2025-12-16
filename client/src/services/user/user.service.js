// services/user.service.js
import { refreshToken } from "../token/refreshToken.token.js";

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL_USER || "http://localhost:5001";

export async function getContacts() {
  try {
    const res = await fetch(`${API_BASE}/api/user/contacts/get`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log("getContacts response data:", data.data);

    if (data?.status == 401) {
      await refreshToken();
    }

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw err;
  }
}

export async function getUserProfile(userId) {
  try {
    const res = await fetch(`${API_BASE}/api/user/id/${userId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data?.status == 401) {
      await refreshToken();
    }

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getUserProfile error:", err);
    throw err;
  }
}
export async function getUserProfileByUsername(username) {
  try {
    const res = await fetch(`${API_BASE}/api/user/search/${username}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data?.status == 401) {
      await refreshToken();
    }
    // console.log("getUserProfileByUsername response data:", data);

    //If backend returns no users, DO NOT throw an error
    if (!data.success && data.message === "No users found") {
      return []; // return empty list
    }

    //If backend returns auth error or other error → return empty list instead of crash
    if (!data.success) {
      console.warn("Search backend returned error:", data.message);
      return [];
    }

    return data.data || [];
  } catch (err) {
    console.error("getUserProfileByUsername error:", err);
    return []; //never throw on search
  }
}

export async function getUserPublicKey(userId) {
  try {
    const res = await fetch(`${API_BASE}/user/public-key/${userId}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();

    if (data?.status == 401) {
      await refreshToken();
    }

    if (!data.success) throw new Error(data.message);

    return data.publicKey;
  } catch (err) {
    console.error("getUserPublicKey error:", err);
    throw err;
  }
}

export async function getMe() {
  try {
    const res = await fetch(`${API_BASE}/api/user/me`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log("getMe response data:", data);

    if (data?.status == 401) {
      // console.log("in get me ")
      await refreshToken();
    }

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getUserPublicKey error:", err);
    throw err;
  }
}
