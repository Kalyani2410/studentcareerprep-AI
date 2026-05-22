import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ExamPrep() {

  const [file, setFile] = useState(null);

  const [text, setText] = useState("");

  const handleUpload = async () => {

    const formData = new FormData();

    formData.append("pdf", file);

    try {

      const response = await axios.post(
        "http://localhost:5000/api/files/upload",
        formData
      );

      setText(response.data.extractedText);

    } catch (error) {

      console.log(error);

    }
  };

  return (
    <div className="flex">

      <Sidebar />

      <div className="p-8 w-full">

        <h1 className="text-3xl font-bold mb-6">
          Exam Preparation
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
        >
          Upload PDF
        </button>

        <div className="mt-8 bg-gray-100 p-4 rounded-lg h-[400px] overflow-y-scroll">

          <h2 className="text-xl font-bold mb-4">
            Extracted Text
          </h2>

          <p className="whitespace-pre-wrap">
            {text}
          </p>

        </div>

      </div>

    </div>
  );
}

export default ExamPrep;