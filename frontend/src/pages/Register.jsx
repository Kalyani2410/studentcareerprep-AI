import { useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
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
                "http://localhost:5000/api/auth/register",
                formData
            );

            setMessage(response.data.message);

        } 

            catch (error) {

  console.log(error);

  console.log(error.response);

  setMessage(
    error.response?.data?.message || "Registration Failed"
  );
}

        
    };

    return (
        <div>
            <Navbar />

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">

                    <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
                        Register
                    </h2>
                    {
                        message && (
                            <p className="text-green-600 text-center mb-4">
                                {message}
                            </p>
                        )
                    }
                    <form className="space-y-4" onSubmit={handleSubmit}>

                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter Name"
                            className="w-full border p-3 rounded-lg"
                        />

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
                            Register
                        </button>

                    </form>

                </div>
            </div>
        </div>
    );
}

export default Register;