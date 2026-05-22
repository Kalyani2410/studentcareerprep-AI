import { Link } from 'react-router-dom'

function Navbar() {
  return (
    <nav className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">CareerPrep AI</h1>

      <div className="space-x-4">
        <Link to="/" className="hover:text-gray-200">Home</Link>
        <Link to="/login" className="hover:text-gray-200">Login</Link>
        <Link to="/register" className="hover:text-gray-200">Register</Link>
      </div>
    </nav>
  )
}

export default Navbar