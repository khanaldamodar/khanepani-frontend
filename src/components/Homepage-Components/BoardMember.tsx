"use client"

import { useEffect, useState } from "react"

import { Users, Calendar } from "lucide-react"
import MemberCard from "../global/IndividualMember"

interface Member {
  id: number
  name: string
  photo: string | null
  number: string
  position: string
  type: string
}

const BoardMembers = () => {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}members`)

        if (!res.ok) throw new Error("Failed to fetch members")

        const data: Member[] = await res.json()

        // Filter members with type "board"
        const boardMembers = data
  .filter((member) => member.type === "board")
  .sort((a, b) => b.id - a.id) // descending by id
setMembers(boardMembers)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchMembers()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading members...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-lg">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-600 text-lg font-semibold mb-2">Error Loading Members</p>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-md mb-6">
            <Users className="w-6 h-6 text-blue-600" />
            <span className="text-blue-600 font-semibold">Board Members</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">कार्य समिति</h1>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-5 h-5" />
            <p className="text-lg font-medium">Board Members (2080 – 2084)</p>
          </div>

          {/* Decorative line */}
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-6 rounded-full"></div>
        </div>

        {/* Members Grid */}
        {members.length === 0 ? (
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600 text-lg font-medium">No board members found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {members.map((member) => (
              <MemberCard key={member.id} {...member} photo={member.photo ?? ""} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default BoardMembers
