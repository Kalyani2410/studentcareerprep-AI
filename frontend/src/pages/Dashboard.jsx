import Sidebar from '../components/Sidebar'

function Dashboard() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8">
          Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Resume Builder</h2>
            <p>Create professional resumes.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">AI Exam Prep</h2>
            <p>Generate 13 and 15 mark answers.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold mb-2">Uploaded Notes</h2>
            <p>Manage uploaded files.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard