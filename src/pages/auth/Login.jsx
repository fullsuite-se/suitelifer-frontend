import React, { useState, useEffect, useRef } from "react";
import api from "../../utils/axios";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.net.min";
import fullsuite from "../../assets/logos/logo-fs-full.svg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
import { getUserFromCookie } from "../../utils/cookie";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

import TestCredentials from "./TestCredentials";
import { ModalResetPassword } from "../../components/modals/ModalResetPassword";
import { Link } from "react-router-dom";
import sendVerification from "../../utils/sendVerification";

const LoginForm = ({ email, password, setEmail, setPassword }) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA is not ready.");
      return;
    }

    const recaptchaToken = await executeRecaptcha("login");
    const recaptcha = await api.post("/api/verify-recaptcha", {
      recaptchaToken: recaptchaToken,
    });
    if (recaptcha.status !== 200) {
      toast.error(recaptcha.data.message);
      return;
    }

    if (!email || !password) {
      toast.error("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/login", {
        email,
        password,
      });

      if (response.data.accessToken) {
        toast.success("Welcome back! You have successfully logged in.");
        navigate("/app/blogs-feed");
      } else if (response.data.recaptchaError) {
        toast.success(response.data.message);
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setLoading(false);
      if (error.response?.status === 400) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.response?.data?.isAttemptExceeded) {
        toast.error(
          "You've reached the maximum number of verification attempts. Please try again in 15 minutes."
        );
      } else if (error.response?.data?.isNotVerified) {
        const id = error.response?.data?.userId;
        const email = error.response?.data?.email;
        setLoading(true);
        const response = await sendVerification(id, email);
        if (response.isSuccess) {
          toast.success("Check your email to verify your account.");
        } else {
          toast.error("Failed to send verification code.");
        }
      } else {
        toast.error(
          `${error.response?.data?.message || "Something went wrong."}`
        );
      }
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-5">
      <div>
        <input
          type="text"
          id="email"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
        />
      </div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          id="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border-none rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="cursor-pointer absolute top-3 right-3 text-gray-500"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      <button
        type="submit"
        className="cursor-pointer hover:bg-[#007a8e] duration-300 mt-5 w-full bg-primary p-3 rounded-xl text-white font-avenir-black"
        disabled={!email || !password || loading} // Disable if fields are empty or loading
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
  );
};

// Main Login Component

const Login = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);
  const [isResetModal, setResetModal] = useState(false); // Fixed typo here

  const [showCredentials, setShowCredentials] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserFromCookie();
      if (user) navigate("/app/blogs-feed");
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

  const handleResetPasswordBtn = () => {
    setResetModal((prev) => !prev); // Fixed typo here
  };

  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE}>
      <div id="vanta-bg" className="min-h-screen bg-white overflow-y-auto">
        <ModalResetPassword
          isOpen={isResetModal}
          handleClose={handleResetPasswordBtn}
        />
        <div
          className={`flex flex-col items-center ${
            !showCredentials ? "justify-center min-h-screen" : "pt-20"
          }`}
        >
          <div
            className="bg-white mx-auto rounded-2xl p-10 py-16 border border-gray-200"
            style={{ width: "min(90%, 600px)" }}
          >
            <img
              src={fullsuite}
              alt="FullSuite"
              onClick={() => navigate("/")}
              className="w-28 h-auto mx-auto cursor-pointer"
            />
            <p className="text-center text-base my-4 text-gray-500 mb-10">
              Welcome, SuiteLifer!
            </p>
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
            />
            <section className="flex justify-between mt-3">
              <Link
                className="text-sm text-primary no-underline hover:underline! cursor-pointer"
                to={"/register"}
              >
                Don't have an account?
              </Link>
              <p
                className="text-sm text-primary no-underline hover:underline! cursor-pointer"
                onClick={handleResetPasswordBtn}
              >
                Reset Password?
              </p>
            </section>
            <div className="flex justify-center">
              <button
                className="mt-10 px-2 py-1 text-xss text-gray-400 border border-gray-200 rounded hover:bg-gray-100"
                onClick={() => setShowCredentials(!showCredentials)}
              >
                TEST CREDENTIALS
              </button>
            </div>
          </div>

          {showCredentials && (
            <div
              className="bg-white mx-auto rounded-2xl p-5 mt-10"
              style={{ width: "min(90%, 600px)" }}
            >
              <TestCredentials setEmail={setEmail} setPassword={setPassword} />
            </div>
          )}
        </div>
      </div>
    </GoogleReCaptchaProvider>
  );
};

export default Login;
