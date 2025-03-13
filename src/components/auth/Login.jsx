import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../config";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.net.min";
import fullsuite from "../../assets/logos/logo-fs-full.svg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
import { getUserFromCookie, refreshToken } from "../../utils/cookie";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const vantaRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromCookie();
      if (!user) {
        const newToken = await refreshToken();
        if (newToken) {
          window.location.reload();
          user = await getUserFromCookie();
        }
      }
      if (user) {
        navigate("/app/blogs-feed");
      }
    };
    fetchUser();
  }, []);

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
      setLoading(true);
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
      setLoading(false);
      if (error.response) {
        if (error.response.status === 401) {
          toast.error("Invalid email or password. Please try again.");
          setEmail("");
          setPassword("");
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      id="vanta-bg"
      className="w-screen h-screen flex justify-start items-center bg-white"
    >
      <div
        className="bg-white mx-auto rounded-2xl p-10 py-16 border border-gray-200"
        style={{ width: "min(90%, 600px)" }}
      >
        <a href="/">
          <img
            src={fullsuite}
            alt="FullSuite"
            className="w-28 h-auto mx-auto"
          />
        </a>
        <p className="text-center text-base my-4 text-gray-500 mb-10">
          Welcome to SuiteLifer!
        </p>
        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <input
              type="text"
              id="email"
              value={email}
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
            />
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
            />
            <button
              type="button"
              className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5 cursor-pointer text-primary" />
              ) : (
                <EyeIcon className="w-5 h-5 cursor-pointer text-primary" />
              )}
            </button>
          </div>
          <button
            type="submit"
            className="mt-5 w-full bg-primary p-3 rounded-xl text-white font-avenir-black cursor-pointer"
          >
            {loading ? (
              <div className="mx-auto w-fit">
                <TwoCirclesLoader
                  bg={"transparent"}
                  color1={"#bfd1a0"}
                  color2={"#ffffff"}
                  width={"135"}
                  height={"24"}
                />
              </div>
            ) : (
              "LOG IN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
