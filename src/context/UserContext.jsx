import { server } from "@/main";
import axios from "axios";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ App loading (like fetching user profile)
  const [loading, setLoading] = useState(true);

  // ✅ Separate loaders (THIS FIXES YOUR ISSUE)
  const [loginLoading, setLoginLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [isAuth, setIsAuth] = useState(false);

  // ✅ LOGIN USER (Send OTP)
  const loginUser = async (email, navigate) => {
    setLoginLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });

      toast.success(data.message || "OTP sent successfully ✅");
      localStorage.setItem("email", email);

      navigate("/verify");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed ❌");
    } finally {
      setLoginLoading(false);
    }
  };

  // ✅ VERIFY USER (Verify OTP)
  const verifyUser = async (otp, navigate, getCart) => {
    setVerifyLoading(true);

    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please login again!");
      setVerifyLoading(false);
      navigate("/login");
      return;
    }

    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        email,
        otp,
      });

      toast.success(data.message || "Verified successfully ✅");

      // ✅ Save token in cookies
      Cookies.set("token", data.token, {
        expires: 15,
        secure: true,
        path: "/",
      });

      // ✅ Save user in state
      setUser(data.user);
      setIsAuth(true);
      getCart();

      // ✅ Clear localStorage OTP email
      localStorage.removeItem("email");

      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Invalid OTP ❌");
    } finally {
      setVerifyLoading(false);
    }
  };

  // ✅ RESEND OTP (No navigation)
  const resendOtp = async () => {
    const email = localStorage.getItem("email");

    if (!email) {
      toast.error("Email not found. Please login again!");
      return;
    }

    setLoginLoading(true);

    try {
      const { data } = await axios.post(`${server}/api/user/login`, { email });
      toast.success(data.message || "OTP resent ✅");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP ❌");
    } finally {
      setLoginLoading(false);
    }
  };

  // ✅ LOGOUT
  const logoutUser = (setTotalItem) => {
    Cookies.remove("token");
    setUser(null);
    setIsAuth(false);
    setTotalItem(0);

    toast.success("Logged out ✅");
  };

  // ✅ OPTIONAL: Auto fetch user profile if token exists
  const getUser = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/my`, {
        headers: {
          token: token,
        },
      });

      setIsAuth(true);
      setUser(data);
      setLoading(false);
    } catch (error) {
      setIsAuth(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        isAuth,

        // ✅ loaders
        loginLoading,
        verifyLoading,

        // ✅ functions
        loginUser,
        verifyUser,
        resendOtp,
        logoutUser,
      }}
    >
      {children}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
