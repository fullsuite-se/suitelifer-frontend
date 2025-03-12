import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../config";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.net.min";
import fullsuite from "../../assets/logos/logo-fs-full.svg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect = null;

    const loadVanta = () => {
      if (!vantaRef.current) {
        effect = GLOBE({
          THREE,
          el: "#vanta-bg",
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: 0xffffff,
          backgroundColor: 0x248da4,
          points: 9.0,
          maxDistance: 22.0,
          spacing: 16.0,
          showDots: true,
        });
      }
    };

    requestAnimationFrame(loadVanta);

    return () => {
      if (effect) effect.destroy();
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.accessToken) {
        toast.success("Welcome back! You have successfully logged in.");
        navigate("/app/blogs-feed");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
        } else {
          toast.error(
            `Error ${error.response.status}: ${
              error.response.data.message || "Something went wrong."
            }`
          );
        }
      } else if (error.request) {
        toast.error(
          "Network error. Please check your connection and try again."
        );
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      id="vanta-bg"
      className="w-screen h-screen flex justify-start items-center bg-white"
    >
      <div
        className="bg-white mx-auto rounded-md p-10 py-16 border border-gray-200"
        style={{ width: "min(90%, 600px)" }}
      >
        <img src={fullsuite} alt="FullSuite" className="w-28 h-auto mx-auto" />
        <h2 className="text-center text-base font-bold my-4">
          Sign In to Your Account
        </h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 focus:border-red-500"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1 pr-10 focus:border-red-500"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 cursor-pointer" />
              ) : (
                <EyeIcon className="w-5 h-5 cursor-pointer" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-primary p-2 rounded text-white font-avenir-black cursor-pointer"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
