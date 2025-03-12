import React, { useState } from "react";
import axios from "axios";
import config from "../../config";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accessToken, setAccessToken] = useState(null);

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
      setAccessToken(response.data.accessToken);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const checkAccess = async () => {
    let tokenToUse = accessToken;
    console.log("Current access token:", tokenToUse);

    if (!tokenToUse) {
      console.log("No access token, trying to refresh...");
      const newToken = await refreshToken();
      if (!newToken) return console.log("Failed to refresh token");

      tokenToUse = newToken;
    }

    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/profile`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${tokenToUse}` },
      });
      console.log("Access checked:", response.data);
    } catch (error) {
      console.error("Access check failed:", error);
    }
  };

  const refreshToken = async () => {
    console.log("Refresh Btn Clicked");
    try {
      const response = await axios.get(
        `${config.apiBaseUrl}/api/refresh-token`,
        { withCredentials: true }
      );

      console.log("Token refreshed:", response.data);
      const newToken = response.data.accessToken;
      setAccessToken(newToken);
      return newToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Login Admin</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
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
        <button type="submit">Login</button>
        <button type="button" onClick={checkAccess}>
          Check Access
        </button>
        <button type="button" onClick={refreshToken}>
          Generate New Token
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
