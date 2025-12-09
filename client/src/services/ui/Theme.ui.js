// /services/ui.service.js

export async function updateTheme(theme) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/cookies/theme/set`, {
      method: "POST",
      credentials: "include",         // include cookies
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ theme }),
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error updating theme:", error);
    return { success: false, message: "Something went wrong" };
  }
}

export async function getTheme() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/ui/theme`, {
      method: "GET",
      credentials: "include",         // read cookies
    });

    return await res.json();
  } catch (error) {
    console.error("Error fetching theme:", error);
    return { success: false };
  }
}
