import React, { useState } from "react";
import axios from "axios";
import config from "../../config";

const EmployeeLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Handle Login Clicked");

    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/login`,
        { email, password },
        { withCredentials: true }
      );

      console.log("Login successful:", response.data);
      alert(response.data);
      setAccessToken(response.data.accessToken);
    } catch (error) {
      alert(error);
      console.error("Login failed:", error);
    }
  };

  return (
    <div>
      <h2>Login Employee</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Username:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="text"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-red-300 p-3">
          Login
        </button>
      </form>
    </div>
  );
};

export default EmployeeLogin;
