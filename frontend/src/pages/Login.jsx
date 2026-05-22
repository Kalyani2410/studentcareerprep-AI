import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

      localStorage.setItem("token", response.data.token);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      setMessage("Invalid Credentials");

    }
  };

  return (
    <div>
      <Navbar />

      <div className="flex justify-center items-center min-h-screen">

        <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

          <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
            Login
          </h2>

          {
            message && (
              <p className="text-center text-green-600 mb-4">
                {message}
              </p>
            )
          }

          <form className="space-y-4" onSubmit={handleSubmit}>

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter Email"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full border p-3 rounded-lg"
            />

            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700">
              Login
            </button>

          </form>

        </div>

      </div>
    </div>
  );
}

export default Login;