import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import logo from "../../assets/logos/logo-fs-tagline.svg";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import api from "../../utils/axios";

const PasswordReset = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleConfirmBtn = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Password do not march");
      return;
    }

    const updatePassword = async () => {
      try {
        const response = await api.post("/api/update-password", {
          newPassword: password,
          token,
        });
        console.log(response.data);
      } catch (error) {
        toast.error(error.response.data.message);
        console.error(error.response.data.message);
      }
    };
    updatePassword();
  };

  return (
    <section className="flex flex-col h-dvh px-7 py-4">
      <section>
        <img src={logo} className="w-32 h-auto" alt="Logo" />
      </section>
      <main className="flex-1 grid place-content-center gap-10">
        <header>
          <h2 className="text-center font-avenir-black">
            <span className="text-primary">RESET</span> YOUR PASSWORD
          </h2>
          <p className="text-gray-400">
            Set your new password and confirm it to complete the reset process
          </p>
        </header>
        <form onSubmit={handleConfirmBtn} className="space-y-4">
          <section className="relative">
            <label htmlFor="password" className="text-primary">
              Enter your new password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-primary"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <EyeSlashIcon className="size-5 cursor-pointer" />
              ) : (
                <EyeIcon className="size-5 cursor-pointer" />
              )}
            </button>
          </section>

          <section className="relative">
            <label htmlFor="confirm-password" className="text-primary">
              Confirm your new password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
              required
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-primary"
              onClick={toggleConfirmPasswordVisibility}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="size-5 cursor-pointer" />
              ) : (
                <EyeIcon className="size-5 cursor-pointer" />
              )}
            </button>
          </section>

          <button
            type="submit"
            className="w-full p-3 bg-primary text-white rounded-md hover:bg-primary/80 font-avenir-black"
          >
            Reset Password
          </button>
        </form>
      </main>
    </section>
  );
};

export default PasswordReset;
