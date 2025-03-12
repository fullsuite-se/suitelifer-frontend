import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import config from "../../config";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import fullsuite from "../../assets/logos/logo-fs-full.svg";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          color: 0xffffff,
          color2: 0xbfd1a0,
          backgroundColor: 0x0097b2,
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
    console.log("Handle Login Clicked");

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      if (response.data.accessToken) {
        toast.success("Login successful!");
        navigate("/app/blogs-feed");
      } else {
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div
      id="vanta-bg"
      className="w-screen h-screen flex justify-start items-center bg-white"
    >
      {/* <div
        className="bg-white rounded-md p-5 py-10 border border-gray-200"
        style={{ width: "min(90%, 500px)" }}
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
          <div>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary p-2 rounded text-white font-avenir-black "
          >
            Login
          </button>
        </form>
      </div> */}
      <div className="w-[43rem] h-full bg-white flex flex-col justify-center px-15">
        <div>
          <img
            src={fullsuite}
            alt="FullSuite"
            className="w-28 h-auto mx-auto"
          />
          <h2 className="text-center text-base font-bold my-4">
            Sign In to Your Account
          </h2>
        </div>
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
          <div>
            <input
              type="password"
              id="password"
              value={password}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mt-1"
            />
          </div>
          <button
            type="submit"
            className="w-full cursor-pointer bg-primary p-2 rounded text-white font-avenir-black "
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
