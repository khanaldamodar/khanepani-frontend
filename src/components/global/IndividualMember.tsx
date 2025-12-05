import type React from "react"
import { useState } from "react"
import { User, Phone, X } from "lucide-react"

interface MemberCardProps {
  photo: string
  name: string
  number: string
  position: string
}

const MemberCard: React.FC<MemberCardProps> = ({ photo, name, number, position }) => {
  const [open, setOpen] = useState(false)
  const imageUrl = `${process.env.NEXT_PUBLIC_IMAGE_URL}${photo}`

  return (
    <>
      <div className="group relative rounded-2xl transition-all duration-300 overflow-hidden transform hover:-translate-y-2">

        {/* IMAGE */}
        <div className="flex justify-center pt-6">
          <img
            src={imageUrl}
            alt={name}
            onClick={() => setOpen(true)}
            className="w-48 h-60 object-cover rounded transition-transform duration-300 group-hover:scale-105 cursor-pointer"
          />
        </div>

        {/* CONTENT */}
        <div className="p-5 text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600">
            {name}
          </h3>

          <div className="flex items-center justify-center gap-2 mb-3">
            <User className="w-4 h-4 text-blue-500" />
            <p className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
              {position}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <p className="text-sm font-medium">{number}</p>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform scale-x-0 group-hover:scale-x-100" />
      </div>

      {/* MODAL POPUP */}
      {open && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          onClick={() => setOpen(false)}  // CLICK OUTSIDE CLOSE
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // PREVENT IMAGE CLICK FROM CLOSING
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute -top-8 right-0 text-white hover:text-red-400"
            >
              <X />
            </button>

            <img
              src={imageUrl}
              alt={name}
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-lg"
            />
          </div>
        </div>
      )}

    </>
  )
}

export default MemberCard
