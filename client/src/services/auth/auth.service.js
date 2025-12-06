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

export const checkUsername = async (username) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/user/username/check`,
      { username },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Return only useful data
    return {
      success: res.data.success,
      message: res.data.message,
      available: res.data.available, 
    };

  } catch (err) {
    // Standardize error output
    return {
      success: false,
      message: err.response?.data?.message || "Username check failed",
    };
  }
};

export const setUsername = async (username) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_USER}/api/user/username/set`,
      { username },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    // Return only useful data
    return {
      success: res.data.success,
      message: res.data.message,
      available: res.data.available, 
    };

  } catch (err) {
    // Standardize error output
    return {
      success: false,
      message: err.response?.data?.message || "Username check failed",
    };
  }
};

