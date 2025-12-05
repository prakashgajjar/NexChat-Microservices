// services/user.service.js

const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL_USER || "http://localhost:5001";

export async function getAllUsers() {
  try {
    const res = await fetch(`${API_BASE}/api/user/all`,{
      credentials: "include",
      headers:{
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getAllUsers error:", err);
    throw err;
  }
}

export async function getUserProfile(userId) {
  try {
    const res = await fetch(`${API_BASE}/user/${userId}`,{
      credentials: "include",
      headers:{
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getUserProfile error:", err);
    throw err;
  }
}

export async function getUserPublicKey(userId) {
  try {
    const res = await fetch(`${API_BASE}/user/public-key/${userId}`,{
      credentials: "include",
      headers:{
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();

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
      headers:{
        "Content-Type": "application/json",
      }
    });
    const data = await res.json();
    console.log("getMe response data:", data);

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getUserPublicKey error:", err);
    throw err;
  }
}
