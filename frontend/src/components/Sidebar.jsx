import { Link } from 'react-router-dom'

function Sidebar() {
  return (
    <div className="w-64 bg-indigo-700 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-10">CareerPrep AI</h2>

      <div className="flex flex-col space-y-4">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/resume">Resume Builder</Link>
        <Link to="/exam">Exam Preparation</Link>
        <Link to="/">Logout</Link>
      </div>
    </div>
  )
}

export default Sidebar