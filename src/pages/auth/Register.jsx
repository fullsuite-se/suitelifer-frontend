import React, { useState } from "react";
import logo from "../../assets/logos/logo-fs-tagline.svg";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/axios";
import TwoCirclesLoader from "../../assets/loaders/TwoCirclesLoader";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import sendVerification from "../../utils/sendVerification";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import VerifyPasswordStrength from "../../components/auth/VerifyPasswordStrength";

const Form = () => {
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [workEmail, setWorkEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const { executeRecaptcha } = useGoogleReCaptcha();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handlePasswordValidation = (value) => {
    setIsPasswordValid(value);
  };

  const handleInputChange = (value, setValue) => {
    setValue(value);
  };

  const submitRegistration = async (recaptchaToken) => {
    const response = await api.post("/api/register", {
      workEmail,
      password,
      firstName,
      middleName,
      lastName,
      recaptchaToken,
    });
    return response;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      toast.error("reCAPTCHA is not ready.");
      return;
    }

    const domain = workEmail.split("@")[1]?.toLowerCase();
    const isValid =
      domain === "fullsuite.ph" ||
      domain === "viascari.com" ||
      domain === "kriyahr.com";

    if (!isValid) {
      toast.error(
        "Please use a Fullsuite-issued or affiliated email address (@fullsuite.ph, @viascari.com, or @kriyahr.com)."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Passwords do not match. Please ensure both passwords are the same."
      );
      return;
    }

    if (!isPasswordValid) {
      toast.error(
        "Weak password! Use 10+ chars, a number, special char, and both cases. InfoSec believes in you! 🔐"
      );
      return;
    }
    try {
      setLoading(true);
      const recaptchaToken = await executeRecaptcha("register");
      const responseRegister = await submitRegistration(recaptchaToken);
      const data = responseRegister.data;
      if (data.isSuccess) {
        const userId = data.userId;
        const email = data.email;
        const responseVerication = await sendVerification(userId, email);
        if (responseVerication.isSuccess) {
          toast.success("Registration successful. Verification link sent.");
        } else {
          toast.error("Failed to send verification link.");
        }
        setFirstName("");
        setMiddleName("");
        setLastName("");
        setWorkEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (error) {
      if (error.response.data.isEmailAlreadyExist) {
        toast.error("Email already exists. Please use a different one.");
      } else {
        console.error("Error during registration:", error);
        toast.error("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
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
      <VerifyPasswordStrength
        password={password}
        confirmPassword={confirmPassword}
        onChangeValidation={handlePasswordValidation}
      />
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
          required
          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
          value={password}
          onChange={(e) => handleInputChange(e.target.value, setPassword)}
        />
        <button
          type="button"
          className="absolute right-3 top-4 text-primary"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeSlashIcon className="size-5 cursor-pointer" />
          ) : (
            <EyeIcon className="size-5 cursor-pointer" />
          )}
        </button>
      </div>
      <div className="relative">
        <input
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your password"
          className="w-full p-3 border-none rounded-md bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary/50"
          required
          value={confirmPassword}
          onChange={(e) =>
            handleInputChange(e.target.value, setConfirmPassword)
          }

          onPaste={(e) => e.preventDefault()}
          onCopy={(e) => e.preventDefault()}
          onCut={(e) => e.preventDefault()}
        />
        <button
          type="button"
          className="absolute right-3 top-4 text-primary"
          onClick={toggleConfirmPasswordVisibility}
        >
          {showConfirmPassword ? (
            <EyeSlashIcon className="size-5 cursor-pointer" />
          ) : (
            <EyeIcon className="size-5 cursor-pointer" />
          )}
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-primary hover:bg-[#007a8e] duration-300 p-3 rounded-md text-white font-avenir-black cursor-pointer"
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
          "SIGN UP"
        )}
      </button>
    </form>
  );
};

const Register = () => {
  return (
    <GoogleReCaptchaProvider reCaptchaKey={import.meta.env.VITE_RECAPTCHA_SITE}>
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
              Join the Suitelifer Community: Post, Engage, and Grow
              Professionally!
            </p>
          </header>
          <Form />
          <p className="text-center">
            <span className="text-gray-400">Already have an account? </span>
            <Link
              className="text-primary cursor-pointer no-underline hover:underline!"
              to={"/login"}
            >
              Log in
            </Link>
          </p>
        </main>
      </section>
    </GoogleReCaptchaProvider>
  );
};

export default Register;
