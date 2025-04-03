import React, { useState } from "react";
import logo from "../../assets/logos/logo-fs-tagline.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleInputChange = (value, setValue) => {
    setValue(value);
  };

  const submitRegistration = async () => {
    const response = await api.post("/api/register", {
      firstName,
      lastName,
      workEmail,
      password,
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      submitRegistration();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="flex flex-col h-dvh px-7 py-4">
      <section>
        <img src={logo} className="w-32 h-auto" alt="Logo" />
      </section>
      <main className="flex-1 grid place-content-center gap-10">
        <header className="text-center">
          <h2 className="font-avenir-black">
            <span className="text-primary">SIGN UP</span> YOUR SUITELIFER
            ACCOUNT
          </h2>
          <p className="text-gray-400">
            Join the SuiteLifer Community: Post, Engage, and Grow
            Professionally!
          </p>
        </header>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
              required
              value={firstName}
              onChange={(e) => handleInputChange(e.target.value, setFirstName)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
              required
              value={lastName}
              onChange={(e) => handleInputChange(e.target.value, setLastName)}
            />
          </div>
          <input
            type="email"
            placeholder="Work Email"
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
            required
            value={workEmail}
            onChange={(e) => handleInputChange(e.target.value, setWorkEmail)}
          />
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
            required
            value={password}
            onChange={(e) => handleInputChange(e.target.value, setPassword)}
          />
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
            required
            value={confirmPassword}
            onChange={(e) =>
              handleInputChange(e.target.value, setConfirmPassword)
            }
          />
          <button
            type="submit"
            className="cursor-pointer w-full p-3 bg-primary text-white rounded-md hover:bg-primary/80 font-avenir-black"
          >
            Sign Up
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            className="font-avenir-black no-underline text-primary cursor-pointer"
            to={"/login"}
          >
            Sign in
          </Link>
        </p>
      </main>
    </section>
  );
};

export default Register;
