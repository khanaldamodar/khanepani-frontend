import { Edit3, Plus, Users , Image} from 'lucide-react'
import React from 'react'

const page = () => {
  return (
     <div className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Admin Dashboard</h2>
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200">
                <Plus size={20} className="mr-2" />
                Add Document
              </button>
              <button className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200">
                <Edit3 size={20} className="mr-2" />
                New Post
              </button>
              <button className="flex items-center justify-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200">
                <Image size={20} className="mr-2" />
                
                Upload Image
              </button>
              <button className="flex items-center justify-center p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200">
                <Users size={20} className="mr-2" />
                Add Member
              </button>
            </div>
          </div>
        </div>
      </div>
  )
}

export default page