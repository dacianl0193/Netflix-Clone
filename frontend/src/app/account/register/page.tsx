'use client';

import { useState } from "react";
import "../../../../styles/account.login.register.css"
import { API_BASE_URL } from "@/app/layout";

import ReCAPTCHA from 'react-google-recaptcha';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from "axios";

const app = () => {
  const [ registering, setRegistering ] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const handleRecaptchaChange = (token: string) => {
    setRecaptchaToken(token);
    document.getElementById("button-register")?.removeAttribute("disabled");
}

  const handleRegistration = () => {
    setRegistering(true);

    const email = (document.getElementById("signin-email") as any)?.value;
    const password = (document.getElementById("signin-password") as any)?.value;
  
    const isNone = (value: any) => {
      return value === undefined || value === null || value === "";
    }

    if (isNone(email) || isNone(password)) {
        toast.error("Please fill out all the fields.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            closeButton: false,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "dark",
        })
    }

    try {
      axios.post(`${API_BASE_URL}/api/v1/account/register`, {
        email,
        password,
        recaptchaToken
      }).then((response) => {
        const json = response.data;

        if (response.status === 200) {
          localStorage.setItem("access_token", json.access_token);
          localStorage.setItem("refresh_token", json.refresh_token);

          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log(error);
        const json = error.response.data;

        toast.error(json.error_description, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          closeButton: false,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "dark",
        })
      })

      setRegistering(false);
      setRecaptchaToken("");
    } catch (error) {
      console.error(error);

      setRegistering(false);
      setRecaptchaToken("");

    } finally {
    }
  }

  const handleFormSubmit = (e: any) => {
    e.preventDefault();
    handleRegistration();
  };

  return (
    <main>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" id="signin-box">
        <div className="flex flex-col items-center justify-center">
          <img src="/logo.png" alt="Flixnet Logo" className="w-48" />
          <h1 className="text-3xl font-bold mt-4">
            Register
            </h1>
          <p className="text-sm mt-2">to continue to Flixnet</p>

          <form className="flex flex-col mt-4" onSubmit={handleFormSubmit}>
            <input type="text" placeholder="Email or phone number" className="p-2 rounded-md focus:outline-none" id="signin-email" />
            <input type="password" placeholder="Password" className="p-2 rounded-md focus:outline-none mt-2" id="signin-password" />
            
            <ReCAPTCHA
                sitekey="6LeaH1kpAAAAADBsFvvdycF2n2Duk9haqHcoYtfu"
                onChange={handleRecaptchaChange as any}
                theme="dark"
                className="recaptcha-box"
            />

            <button
              className="bg-red-600 text-white rounded-md p-2 mt-2"
              id="button-register"
              disabled={true}
              aria-disabled={registering}>
                {registering ? "Registering..." : "Register"}           
            </button>
          </form>
            <div className="flex flex-col mt-4">
                <p className="text-sm">New to Flixnet? <a href="/account/login" className="text-red-600">Sign In</a>.</p>
            </div>
          </div>
      </div>
      <div className="flex min-h-screen flex-col items-center justify-between p-24" id="grid-container">
      </div>
      <p className="text-sm mt-2 text-center">This page is protected by Google reCAPTCHA to ensure you're not a bot. <a href="#" className="text-red-600">Learn more</a>.</p>
      <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          closeButton={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
      />
    </main>
  )
}

export default app;