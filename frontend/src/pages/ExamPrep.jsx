import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

function ExamPrep() {
  const [file, setFile] = useState(null);
  const [studyNotes, setStudyNotes] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    setMessage("");

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

      setStudyNotes(response.data.studyNotes);
      setMessage(
        response.data.truncated
          ? "PDF Uploaded — note: only the first part of a very large PDF was analyzed"
          : "PDF Uploaded Successfully"
      );
    } catch (error) {
      console.log("UPLOAD ERROR:", error);
      setStudyNotes(null);
      setMessage(
        error.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-indigo-600 mb-6">
          Exam Preparation AI
        </h1>

        {message && (
          <p className="mb-4 text-center text-indigo-700 font-semibold">
            {message}
          </p>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md">
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files[0])}
            className="border p-2 rounded-lg w-full mb-4 bg-white cursor-pointer"
          />

          <button
            onClick={handleUpload}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Upload PDF"}
          </button>
        </div>

        {studyNotes && (
          <div className="mt-8 bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-3xl font-bold text-gray-800">{studyNotes.title}</h2>
            <p className="text-indigo-500 font-semibold mb-6">{studyNotes.subject}</p>

            {studyNotes.topics?.map((t, i) => (
              <div key={i} className="mb-8 border-b pb-6 last:border-b-0">
                <h3 className="text-xl font-bold text-gray-700 mb-2">{t.topic}</h3>
                <p className="text-gray-600 mb-3">{t.simple_explanation}</p>

                {t.key_points?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Key Points</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {t.key_points.map((kp, j) => (
                        <li key={j} className="text-gray-600">
                          <span className="font-medium text-gray-800">{kp.term}:</span> {kp.explanation}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.definitions?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Definitions</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {t.definitions.map((d, j) => (
                        <li key={j} className="text-gray-600">
                          <span className="font-medium text-gray-800">{d.term}:</span> {d.definition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.examples?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Examples</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {t.examples.map((ex, j) => (
                        <li key={j} className="text-gray-600">{ex}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.formulas?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Formulas</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {t.formulas.map((f, j) => (
                        <li key={j} className="text-gray-600 font-mono">{f}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.exam_points?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-700 mb-1">Exam Focus</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {t.exam_points.map((e, j) => (
                        <li key={j} className="text-gray-600">{e}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {t.keywords?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {t.keywords.map((k, j) => (
                      <span
                        key={j}
                        className="bg-indigo-100 text-indigo-700 text-sm px-3 py-1 rounded-full"
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {studyNotes.quick_revision?.length > 0 && (
              <div className="mb-8 bg-indigo-50 p-4 rounded-lg">
                <h3 className="text-xl font-bold text-indigo-700 mb-2">Quick Revision</h3>
                <ul className="list-disc list-inside space-y-1">
                  {studyNotes.quick_revision.map((q, i) => (
                    <li key={i} className="text-gray-700">{q}</li>
                  ))}
                </ul>
              </div>
            )}

            {studyNotes.important_questions && (
              <div>
                <h3 className="text-xl font-bold text-gray-700 mb-3">Practice Questions</h3>

                {studyNotes.important_questions.short_answer?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-600 mb-1">Short Answer</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {studyNotes.important_questions.short_answer.map((q, i) => (
                        <li key={i} className="text-gray-600">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {studyNotes.important_questions.concept_based?.length > 0 && (
                  <div className="mb-3">
                    <h4 className="font-semibold text-gray-600 mb-1">Concept-Based</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {studyNotes.important_questions.concept_based.map((q, i) => (
                        <li key={i} className="text-gray-600">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {studyNotes.important_questions.application_based?.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-600 mb-1">Application-Based</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {studyNotes.important_questions.application_based.map((q, i) => (
                        <li key={i} className="text-gray-600">{q}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExamPrep;