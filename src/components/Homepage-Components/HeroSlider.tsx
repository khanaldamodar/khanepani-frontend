"use client"

import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import Loader from "../global/Loader"

interface GalleryItem {
  id: number
  title: string
  category: string | null
  images: string[]
}

interface Member {
  id: number
  name: string
  photo: string | null
  position: string
  type: string
  number: string | null
}
interface Member {
  id: number
  name: string
  photo: string | null
  position: string
  type: string
  number: string | null
  transition_period: {
    id: number
    name: string
    start_date: number
    end_date: number
  }
}

const GalleryWithMembers = () => {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [boardMembers, setBoardMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingGallery, setLoadingGallery] = useState(true)
  const [loadingMembers, setLoadingMembers] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const [galleryRes, membersRes] = await Promise.all([
          fetch(`${apiUrl}gallery`, { cache: "force-cache" }),
          fetch(`${apiUrl}members`),
        ])

        if (!galleryRes.ok) throw new Error("Failed to fetch gallery")
        if (!membersRes.ok) throw new Error("Failed to fetch members")

        const galleryData: GalleryItem[] = await galleryRes.json()
        const membersData: Member[] = await membersRes.json()

        const currentYear = new Date().getFullYear()

        const filteredMembers = membersData.filter((m) => {
          const isBoard = m.type === "board"

          const isTopPosition = [
            "अध्यक्ष",
            "उपाध्याक्ष",
            "सचिब",
            "Chairman",
            "Vice Chairman",
            "Secretary",
          ].includes(m.position)

          const isCurrentPeriod =
            m.transition_period &&
            currentYear >= m.transition_period.start_date &&
            currentYear <= m.transition_period.end_date

          return isBoard && isTopPosition && isCurrentPeriod
        })
        console.log("Filtered Members:", filteredMembers)

        setGalleryItems(galleryData)
        setLoadingGallery(false)
        setBoardMembers(filteredMembers)
        setLoadingMembers(false)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="py-5 px-4 sm:px-6 lg:px-8 font-poppins">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 items-stretch">

          {/* Gallery Slider */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">

              {/* <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Photo Gallery
                </h2>
              </div> */}

              {loadingGallery ? (
                <div className="h-96 flex items-center justify-center">
                  {/* <Loader /> */}
                  Loading...
                </div>
              ) : (
                <div className="relative flex-1">

                  <Swiper
                    spaceBetween={0}
                    slidesPerView={1}
                    loop={true}
                    autoplay={{
                      delay: 2000,
                      disableOnInteraction: false,
                    }}
                    pagination={{
                      clickable: true,
                      bulletClass: "swiper-pagination-bullet !bg-white/70 !w-3 !h-3",
                      bulletActiveClass: "swiper-pagination-bullet-active !bg-white !scale-125",
                    }}
                    effect="fade"
                    fadeEffect={{ crossFade: true }}
                    modules={[Autoplay, Pagination, EffectFade]}
                    className="gallery-swiper"
                  >
                    {galleryItems
                      .filter((item) => item.category === "banner")
                      .flatMap((item) =>
                        item.images.map((img, index) => (
                          <SwiperSlide key={`${item.id}-${index}`}>
                            <div className="relative group">
                              <img
                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                alt={item.title}
                                className="w-full h-48 sm:h-64 md:h-80 lg:h-[500px] xl:h-[540px] object-cover transition-transform duration-700 group-hover:scale-105"
                              />

                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>

                              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                                <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                  <h3 className="text-white text-xl sm:text-2xl lg:text-3xl font-bold mb-2 drop-shadow-lg">
                                    {item.title}
                                  </h3>
                                  <span className="inline-block bg-blue-600/90 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                                    Banner
                                  </span>
                                </div>
                              </div>
                            </div>
                          </SwiperSlide>
                        ))
                      )
                    }

                  </Swiper>
                </div>
              )}
            </div>
          </div>

          {/* Board Members */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden h-full flex flex-col">

              {/* <div className="p-6 border-b border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
                  Board Members
                </h2>
              </div> */}

              <div className="p-6 overflow-y-auto flex-1">

                {loadingMembers ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : boardMembers.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                      </svg>
                    </div>
                    <p className="text-slate-500 font-medium">No board members found</p>
                  </div>
                ) : (
                  <div className="flex flex-col justify-center gap-6 h-full">


                    {boardMembers.map((member, index) => (
                      <div
                        key={member.id}
                        className="group relative bg-gradient-to-r from-slate-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-300 border border-slate-100 hover:border-blue-200 min-h-[120px]"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24">
                            <img
                              src={
                                member.photo
                                  ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${member.photo}`
                                  : "/professional-headshot.png"
                              }
                              alt={member.name}
                              className="w-full h-full object-contain rounded-full border-2 sm:border-3 border-white shadow-lg group-hover:scale-105 transition-transform duration-300 bg-[#CADCE4]"
                            />
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-blue-500 rounded-full border-2 border-white"></div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-800 text-sm sm:text-base md:text-lg truncate group-hover:text-blue-700 transition-colors">
                              {member.name}
                            </h3>
                            <p className="text-blue-600 font-medium text-xs sm:text-sm md:text-sm mb-1">{member.position}</p>
                            {member.number && (
                              <p className="text-slate-500 text-xs flex items-center gap-1 sm:text-sm">
                                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  />
                                </svg>
                                {member.number}
                              </p>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .gallery-swiper .swiper-pagination {
          bottom: 10px !important;
        }
        
        .gallery-swiper .swiper-pagination-bullet {
          margin: 0 6px !important;
          transition: all 0.3s ease !important;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .group:hover .group-hover\\:scale-105 {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  )
}

export default GalleryWithMembers
