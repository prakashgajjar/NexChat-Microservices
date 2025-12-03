import { useEffect, useState } from "react";
import axios from "axios";

axios.defaults.withCredentials = true; // send cookies automatically

export default function AuthCheck({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/api/auth/me`);
        setUser(res.data);   // { name, email, _id }
      } catch (err) {
        setUser(null);       // No token or expired
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!user) return <p>User not logged in</p>;

  return (
    <div>
      <h3>User Logged In:</h3>
      <p>Name: {user.name}</p>
      <p>ID: {user._id}</p>

      {/* Render children only if user is authenticated */}
      {children}
    </div>
  );
}
