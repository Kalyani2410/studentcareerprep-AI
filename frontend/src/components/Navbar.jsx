import { Link } from 'react-router-dom'

function Navbar() {

  return (

    <nav className="bg-[#B8E3E9] text-[#172B35] px-8 py-4 flex justify-between items-center border-b border-[#DDECEF]">

      <h1 className="text-2xl font-bold">
        CareerPrep AI
      </h1>

      <div className="space-x-4">

        <Link
          to="/"
          className="hover:text-[#3F6570] transition-colors duration-200"
        >
          Home
        </Link>

        <Link
          to="/login"
          className="hover:text-[#3F6570] transition-colors duration-200"
        >
          Login
        </Link>

        <Link
          to="/register"
          className="hover:text-[#3F6570] transition-colors duration-200"
        >
          Register
        </Link>

      </div>

    </nav>

  )
}

export default Navbar