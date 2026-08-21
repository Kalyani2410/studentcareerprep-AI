import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      );

      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      setMessage("Invalid Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#172B35]">
      <Navbar />

      <main className="min-h-[calc(100vh-73px)] flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="text-center mb-8">

            {/* <div className="mx-auto mb-5 w-14 h-14 rounded-2xl bg-[#B8E3E9] flex items-center justify-center">
              <span className="text-2xl">✦</span>
            </div> */}

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#172B35]">
              Welcome back
            </h2>

            <p className="mt-3 text-[#60747C] text-sm sm:text-base">
              Continue your journey with CareerPrep AI.
            </p>

          </div>

          {/* Login Card */}
          <div className="bg-white border border-[#DDECEF] rounded-2xl p-7 sm:p-9 shadow-[0_8px_30px_rgba(23,43,53,0.06)]">

            {message && (
              <div className="mb-5 rounded-lg bg-[#FFF5F5] border border-[#F0D6D6] px-4 py-3 text-sm text-red-600">
                {message}
              </div>
            )}

            <form
              className="space-y-5"
              onSubmit={handleSubmit}
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-[#172B35] mb-2"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#C9DDE1] bg-white text-[#172B35] placeholder:text-[#8A9BA1] outline-none transition-all duration-200 focus:border-[#7FCAD3] focus:ring-4 focus:ring-[#B8E3E9]/40"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-[#172B35] mb-2"
                >
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full px-4 py-3 rounded-lg border border-[#C9DDE1] bg-white text-[#172B35] placeholder:text-[#8A9BA1] outline-none transition-all duration-200 focus:border-[#7FCAD3] focus:ring-4 focus:ring-[#B8E3E9]/40"
                />
              </div>

              {/* Login button */}
              <button
                type="submit"
                className="w-full bg-[#172B35] text-white py-3.5 rounded-lg font-medium transition-all duration-200 hover:bg-[#29434F] hover:-translate-y-0.5 hover:shadow-lg"
              >
                Login
              </button>

            </form>

            {/* Register */}
            <div className="mt-7 pt-6 border-t border-[#E5EFF1] text-center">

              <p className="text-sm text-[#60747C]">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-[#315B65] hover:text-[#172B35] transition-colors"
                >
                  Create one
                </Link>
              </p>

            </div>

          </div>

          {/* Bottom text */}
          <p className="text-center text-xs text-[#8A9BA1] mt-6">
            Build your resume. Prepare for exams. Get career-ready.
          </p>

        </div>

      </main>
    </div>
  );
}

export default Login;