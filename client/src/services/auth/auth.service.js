import axios from "axios";

// Signup
export const getOtp  = async (email) => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL_AUTH)
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/api/otp/send`, email, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Signup failed" };
  }
};

export const verifyOtp = async (userData) => {
  console.log(process.env.NEXT_PUBLIC_BACKEND_URL_AUTH)
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/api/otp/verify`, userData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Signup failed" };
  }
};


// Login
export const loginUser = async (userData) => {
  console.log(userData);
  try {
    const res = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL_AUTH}/api/auth/login`, userData, {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    });

    return res.data;
  } catch (err) {
    throw err.response?.data || { message: "Login failed" };
  }
};
