import type React from "react"
import { User, Phone } from "lucide-react"

interface MemberCardProps {
  photo: string
  name: string
  number: string
  position: string
}

const MemberCard: React.FC<MemberCardProps> = ({ photo, name, number, position }) => {
  return (
    <div className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">
      {/* Gradient overlay for visual interest */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Image container with overlay */}
      <div className="relative overflow-hidden">
        <img
          src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${photo}`}
          alt={name}
          className="w-full h-64 sm:h-56 md:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Gradient overlay on image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-6 text-center relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
          {name}
        </h3>

        <div className="flex items-center justify-center gap-2 mb-3">
          <User className="w-4 h-4 text-blue-500" />
          <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{position}</p>
        </div>

        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <p className="text-sm font-medium">{number}</p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
    </div>
  )
}

export default MemberCard
