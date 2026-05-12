import React, { useState } from "react";
import logo from "../assets/logo.jpg";
import google from "../assets/google.png"; // make sure this exists

import { auth, provider } from "../utils/Firebase";
import axios from "axios";
import { serverUrl } from "../App";

import { MdOutlineRemoveRedEye, MdRemoveRedEye } from "react-icons/md";
import { useNavigate, useLocation } from "react-router-dom";
import { signInWithPopup } from "firebase/auth";

import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = async () => {
    try {
      const response = await signInWithPopup(auth, provider);

      const user = response.user;

      const result = await axios.post(
        serverUrl + "/api/auth/googlesignup",
        {
          name: user.displayName,
          email: user.email,
          role,
        },
        { withCredentials: true }
      );

      dispatch(setUserData(result.data));
      const dest = location.state?.from?.pathname || "/";
      navigate(dest);

      toast.success("Login Successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="bg-purple-50 w-[100vw] h-[100vh] flex items-center justify-center flex-col gap-3">
      <form
        className="w-[90%] md:w-[800px] h-[600px] bg-white shadow-xl rounded-2xl flex"
        onSubmit={(e) => e.preventDefault()}
      >
        {/* LEFT */}
        <div className="md:w-[50%] w-full flex flex-col items-center justify-center gap-4">
          <div>
            <h1 className="font-semibold text-black text-2xl">
              Welcome back
            </h1>
            <h2 className="text-gray-500 text-lg">
              Login to your account
            </h2>
          </div>

          {/* EMAIL */}
          <div className="flex flex-col gap-1 w-[85%]">
            <label className="font-semibold text-black">Email</label>
            <input
              type="text"
              className="border w-full h-[35px] px-3"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="flex flex-col gap-1 w-[85%] relative">
            <label className="font-semibold text-black">Password</label>
            <input
              type={show ? "text" : "password"}
              className="border w-full h-[35px] px-3"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {!show ? (
              <MdOutlineRemoveRedEye
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShow(true)}
              />
            ) : (
              <MdRemoveRedEye
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShow(false)}
              />
            )}
          </div>

          {/* ROLE */}
          <div className="flex gap-3">
            <span
              className={`px-3 py-1 border rounded cursor-pointer ${
                role === "student"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </span>

            <span
              className={`px-3 py-1 border rounded cursor-pointer ${
                role === "educator"
                  ? "bg-black text-white"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => setRole("educator")}
            >
              Educator
            </span>
          </div>

          {/* LOGIN BUTTON */}
          <button
            className="w-[80%] h-[40px] bg-black text-white rounded"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="white" /> : "Login"}
          </button>

          <span
            className="text-sm cursor-pointer text-gray-500"
            onClick={() => navigate("/forgotpassword")}
          >
            Forgot password?
          </span>

          {/* GOOGLE */}
          <div
            className="w-[80%] h-[40px] border flex items-center justify-center gap-2 cursor-pointer"
            onClick={googleLogin}
          >
            <img src={google} alt="google" className="w-5" />
            <span className="text-gray-500">Google</span>
          </div>

          <div className="text-gray-500">
            Don't have an account?{" "}
            <span
              className="underline text-black cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </div>
        </div>

        {/* RIGHT */}
        <div className="w-[50%] bg-black hidden md:flex flex-col items-center justify-center rounded-r-2xl">
          <img src={logo} className="w-20" alt="logo" />
        </div>
      </form>
    </div>
  );
}

export default Login;

