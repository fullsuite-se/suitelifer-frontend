import React, { useState } from "react";
import logo from "../../assets/logos/logo-fs-tagline.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";

const Register = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (value, setValue) => {
    setValue(value);
  };

  const submitRegistration = async () => {
    const response = await api.post("/api/register", {
      workEmail,
      password,
      firstName,
      middleName,
      lastName,
    });
    return response;
  };

  const sendVerification = async (userId, email) => {
    const response = await api.post("/api/send-verification-code", {
      userId: userId,
      email: email,
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const responseRegister = await submitRegistration();
      if (responseRegister.data.isSuccess) {
        const userId = responseRegister.data.userId;
        const email = responseRegister.data.email;
        const responseVerication = await sendVerification(userId, email);
        if (responseVerication.data.isSuccess) {
          toast.success("Registration successful. Verification code sent.");
        } else {
          toast.error("Failed to send verification code.");
        }
      } else {
        toast.error("Registration failed.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="flex flex-col h-dvh px-7 py-4">
      <section>
        <img src={logo} className="w-32 h-auto" alt="Logo" />
      </section>
      <main className="flex-1 grid content-center gap-10 max-w-4xl mx-auto">
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
              placeholder="Middle Name"
              className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
              required
              value={middleName}
              onChange={(e) => handleInputChange(e.target.value, setMiddleName)}
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
            className="w-full bg-primary p-3 rounded-md text-white font-avenir-black cursor-pointer"
          >
            {loading ? (
              <div className="mx-auto w-fit">
                <TwoCirclesLoader
                  bg={"transparent"}
                  color1={"#bfd1a0"}
                  color2={"#ffffff"}
                  width={"57"}
                  height={"24"}
                />
              </div>
            ) : (
              "LOG IN"
            )}
          </button>
        </form>
        <p className="text-center">
          Already have an account?{" "}
          <Link
            className="font-avenir-black no-underline text-primary cursor-pointer"
            to={"/login"}
          ></Link>
        </p>
      </main>
    </section>
  );
};

export default Register;
