import React, { useState } from "react";
import axios from "../helper/axios";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../auth/LoginContext";
import Swal from "sweetalert2";
import { Mail, Lock } from "lucide-react";

const AuthPage = () => {
  const { dispatch }: any = useLogin();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({
    email: "",
    user_password: "",
  });

  // Handle changes for form inputs
  const handleChangelogin = (field: string, value: string) => {
    setPayload((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle form submission for login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("/api/vapi_chatbot/login/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response?.data?.token) {
        Swal.fire({
          title: "Login successful!",
          icon: "success",
        });
        console.log(response.data)

        // Extract user and token from response
        const user_data = response.data
        const { token: newToken, ...user } = response.data;

        // Save user and token to localStorage
        localStorage.setItem("user", JSON.stringify(user_data));
        localStorage.setItem("token", newToken);
        console.log(user_data)

        // Dispatch login action
        dispatch({ type: "LOGIN", payload: { user, token: newToken } });

        switch (user.user_type) {
          case "user":
            navigate("/millis_dashboard");
            break;
          case "admin":
            navigate("/admin_business_msg");
            break;
          case "students":
            navigate("/profile");
            break;
          default:
            navigate("/");
            break;
        }

      } else {
        Swal.fire({
          title: "Login failed!",
          text: "Invalid email or password.",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      Swal.fire({
        title: "Login failed!",
        text: "An error occurred while logging in.",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <div className="bg-white shadow-2xl rounded-2xl flex overflow-hidden w-[80%] max-w-5xl transform hover:scale-[1.02] transition-transform duration-300">
        {/* Image Section */}
        <div className="w-1/2">
          {/* Add Image here */}
          <img
            src={`/login.jpg`}
            alt="Welcome Back"
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Form Section */}
        <div className="w-1/2 p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Sign In</h2>
            <p className="text-gray-600 mb-8">Please sign in to continue</p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  onChange={(e) => handleChangelogin("email", e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  onChange={(e) =>
                    handleChangelogin("user_password", e.target.value)
                  }
                  required
                  className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-950 text-white rounded-lg py-3 px-4 font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Sign In
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
