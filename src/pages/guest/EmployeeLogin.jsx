import React, { useState } from "react";
import axios from "axios";
import config from "../../config";

const EmployeeLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${config.apiBaseUrl}/api/login`,
        {
          username,
          password,
        },
        { withCredentials: true }
      );
      console.log("Login successful:", response.data);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  // const checkAccess = async () => {
  //   try {
  //     const response = await axios.get(`${config.apiBaseUrl}/api/profile`, {
  //       withCredentials: true,
  //     });
  //     console.log("Access checked:", response.data);
  //   } catch (error) {
  //     if (error.response && error.response.status === 401) {
  //       // If the token has expired, refresh it
  //       console.log("Token expired, refreshing...");
  //       const newAccessToken = await refreshToken();
  //       if (newAccessToken) {
  //         // Retry the original request with the new token
  //         try {
  //           const retryResponse = await axios.get(
  //             `${config.apiBaseUrl}/api/profile`,
  //             {
  //               withCredentials: true,
  //               headers: {
  //                 Authorization: `Bearer ${newAccessToken}`,
  //               },
  //             }
  //           );
  //           console.log("Access checked after refreshing:", retryResponse.data);
  //         } catch (retryError) {
  //           console.error("Access check failed after retry:", retryError);
  //         }
  //       } else {
  //         console.error("Unable to refresh token, please log in again.");
  //       }
  //     } else {
  //       console.error("Access check failed:", error);
  //     }
  //   }
  // };

  const checkAccess = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/profile`, {
        withCredentials: true,
      });
      console.log("Access checked:", response.data);
    } catch (error) {
      console.error("Access check failed:", error);
    }
  };

  const refreshToken = async () => {
    try {
      const response = await axios.get(`${config.apiBaseUrl}/api/refresh`, {
        withCredentials: true,
      });
      console.log("Token refreshed:", response.data);
      return response.data.accessToken;
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return null;
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
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
        <button>Generate New Token</button>
      </form>
    </div>
  );
};

export default EmployeeLogin;
