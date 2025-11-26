// Example React hook or utility
function scheduleTokenRefresh() {
  // refresh every 14 min (before 15 min expiry)
  setInterval(async () => {
    try {
      const res = await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include", // send cookie
      });
      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);
    } catch (err) {
      console.log("Refresh failed", err);
    }
  }, 14 * 60 * 1000);
}
