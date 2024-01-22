'use client';

import { useState } from "react";
import "../../../../styles/account.login.css"
import axios from "axios";
import { API_BASE_URL } from "@/app/layout";

const app = () => {
  const [ signingIn, setSigningIn ] = useState(false);

  const handleLogin = () => {
    setSigningIn(true);

    try {
      const email = (document.getElementById("signin-email") as any).value;
      const password = (document.getElementById("signin-password") as any).value;

      console.log(email, password);

      const authorization = {
        email,
        password
      }

      axios.post(`${API_BASE_URL}/api/v1/account/oauth/token`, {
        grant_type: "client_credentials"
      }, {
          headers: {
              Authorization: "Basic " + Buffer.from(JSON.stringify(authorization), "utf-8").toString("base64")
          }
      }).then((response) => {
        const json = response.data;

        if (response.status === 200) {
          localStorage.setItem("access_token", json.access_token);
          localStorage.setItem("refresh_token", json.refresh_token);

          window.location.href = "/";
        } else {
          throw new Error("Invalid credentials");
        }
      })
    } catch (error) {
      console.error(error);
    } finally {
      setSigningIn(false);
    }
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <main>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id="signin-box">
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" alt="Flixnet Logo" className="w-48" />
          <h1 className="text-3xl font-bold mt-4">
            Sign In
            </h1>
          <p className="text-sm mt-2">to continue to Flixnet</p>

          <form className="flex flex-col mt-4" onSubmit={handleFormSubmit}>
            <input type="text" placeholder="Email or phone number" className="p-2 rounded-md focus:outline-none" id="signin-email" />
            <input type="password" placeholder="Password" className="p-2 rounded-md focus:outline-none mt-2" id="signin-password" />
            <button 
              className="bg-red-600 text-white rounded-md p-2 mt-2"
              aria-disabled={signingIn}>
                {signingIn ? "Signing In..." : "Sign In"}              
            </button>
          </form>
          </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-between p-24" id="grid-container">
      </div>
    </main>
  )
}

export default app;