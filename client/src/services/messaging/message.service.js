// services/message.service.js

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL_MESSAGES || "http://localhost:5002";

export async function sendMessage(payload) {
  try {
    const res = await fetch(`${API_BASE}/message/send`, {
      method: "POST",
      withCredentials:true,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("sendMessage error:", err);
    throw err;
  }
}

export async function getChatMessages(chatId) {
  try {
    const res = await fetch(`${API_BASE}/messages/${chatId}`);
    const data = await res.json();

    if (!data.success) throw new Error(data.message);

    return data.data;
  } catch (err) {
    console.error("getChatMessages error:", err);
    throw err;
  }
}
