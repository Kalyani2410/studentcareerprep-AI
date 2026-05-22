import Navbar from '../components/Navbar'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <Navbar />

      <div className="min-h-screen flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-5xl font-bold text-indigo-700 mb-6">
          AI-Powered Student Career & Exam Preparation Platform
        </h1>

        <p className="text-gray-700 text-lg max-w-3xl mb-8">
          Build professional resumes and generate 13-mark and 15-mark university answers from uploaded study materials.
        </p>

        <div className="space-x-4">
          <Link to="/register">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              Get Started
            </button>
          </Link>

          <Link to="/login">
            <button className="border border-indigo-600 text-indigo-600 px-6 py-3 rounded-lg hover:bg-indigo-100">
              Login
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default Home