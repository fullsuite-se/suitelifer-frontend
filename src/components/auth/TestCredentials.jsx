import { useState } from "react";
import { useEffect } from "react";
import  copyIcon  from "../../assets/icons/copyIcon.svg";

export default function TestCredentials({ setEmail, setPassword }) {

  const credentials = [
    {
      role: "Branding Manager / PR",
      email: "brandtest@fullsuite.ph",
      password: "password",
    },
    {
      role: "Employee",
      email: "hernani.domingo@fullsuite.ph",
      password: "password",
    },
  ];

  return (
    <div className="flex flex-col items-center  p-6">
    <p className="text-body! font-avenir-black">TEST CREDENTIALS</p>
    <div className="w-full max-w-lg space-y-4">
      {credentials.map((cred, index) => (
        <div
          key={index}
          className="flex justify-between items-center border border-primary rounded-lg p-4"
        >
          <div className="flex flex-col">
            <h4 className="text-primary font-avenir-black mt-0! mb-0!">{cred.role}</h4>
            <p className="text-gray-700 text-sm">{cred.email}</p>
            <p className="text-gray-700 text-sm">{cred.password}</p>
          </div>

          <button
            className="flex items-center gap-2 bg-cyan-50 text-primary px-3 py-1 text-sm rounded-md hover:bg-cyan-100 transition"
            onClick={() => {
              setEmail(cred.email);
              setPassword(cred.password);
            }}
          >
            <img src={copyIcon} alt="Copy" className="w-4 h-4" />
            USE
          </button>
        </div>
      ))}
    </div>
  </div>
  );
}
