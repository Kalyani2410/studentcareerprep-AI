import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ExamPrep() {

  const [file, setFile] = useState(null);

  const [text, setText] = useState("");

  const [message, setMessage] = useState("");

  const handleUpload = async () => {

    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    console.log("SELECTED FILE:", file);

    const formData = new FormData();

    formData.append("pdf", file);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);

      setText(response.data.summary);

      setMessage("PDF Uploaded Successfully");

    } catch (error) {

      console.log("UPLOAD ERROR:", error);

      console.log("SERVER ERROR:", error.response);

      setMessage(
        error.response?.data?.message || "Upload Failed"
      );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      <Sidebar />

      <div className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-indigo-600 mb-6">
          Exam Preparation AI
        </h1>

        {
          message && (
            <p className="mb-4 text-center text-red-500 font-semibold">
              {message}
            </p>
          )
        }

        <div className="bg-white p-6 rounded-xl shadow-md">

          <input
            type="file"
            accept=".pdf"
            onChange={(e) => {
              console.log(e.target.files[0]);
              setFile(e.target.files[0]);
            }}
            className="border p-2 rounded-lg w-full mb-4 bg-white cursor-pointer"
          />

          <button
            onClick={handleUpload}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
          >
            Upload PDF
          </button>

        </div>

        <div className="mt-8 bg-white p-6 rounded-xl shadow-md h-[500px] overflow-y-scroll">

          <h2 className="text-2xl font-bold mb-4 text-gray-700">
            Summary
          </h2>

          <p className="whitespace-pre-wrap text-gray-600">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ExamPrep;