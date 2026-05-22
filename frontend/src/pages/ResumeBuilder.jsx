import Sidebar from '../components/Sidebar'

function ResumeBuilder() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8">
          Resume Builder
        </h1>

        <div className="bg-white p-8 rounded-xl shadow-lg max-w-3xl">
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              className="w-full border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Skills"
              className="w-full border p-3 rounded-lg"
            />

            <textarea
              placeholder="Projects"
              className="w-full border p-3 rounded-lg h-32"
            ></textarea>

            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              Download Resume
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ResumeBuilder