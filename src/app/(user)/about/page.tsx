"use client"
import { useEffect, useState } from "react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination } from "swiper/modules"
import "swiper/css"
import "swiper/css/pagination"

const AboutUs = () => {
    const [aboutUs, setAboutUs] = useState<string>("")
    const [gallery, setGallery] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL

                const [aboutRes, galleryRes] = await Promise.all([
                    fetch(`${apiUrl}settings`),
                    fetch(`${apiUrl}gallery`)
                ])

                const aboutData = await aboutRes.json()
                const galleryData = await galleryRes.json()

                setAboutUs(
                    aboutData.about ||
                    "We are passionate about creating exceptional experiences and building meaningful connections with our community."
                )

                // ✅ FILTER ONLY ABOUT IMAGES
                const aboutImages = galleryData.filter(
                    (item: any) => item.category === "about"
                )

                setGallery(aboutImages)
            } catch (err) {
                setError("Failed to load data")
                setAboutUs(
                    "We are passionate about creating exceptional experiences and building meaningful connections with our community."
                )
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <section className="py-10 px-6 font-poppins">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                        About Us
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* CONTENT */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">

                    {/* LEFT SLIDER */}
                    <div>
                        {gallery.length > 0 ? (
                            <Swiper
                                modules={[Autoplay, Pagination]}
                                autoplay={{ delay: 3000 }}
                                pagination={{ clickable: true }}
                                loop={true}
                                className="rounded-xl shadow-xl"
                            >
                                {gallery.flatMap((item) =>
                                    item.images.map((img: string, index: number) => (
                                        <SwiperSlide key={`${item.id}-${index}`}>
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                                                alt={item.title}
                                                className="w-full h-[350px] object-cover rounded-xl"
                                            />
                                        </SwiperSlide>
                                    ))
                                )}
                            </Swiper>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center bg-gray-200 rounded-xl">
                                <p className="text-gray-600 text-sm">No about images found</p>
                            </div>
                        )}
                    </div>

                    {/* RIGHT TEXT */}
                    <div className="space-y-6">
                        <p className="text-lg leading-relaxed text-slate-700 font-medium text-justify">
                            {aboutUs}
                        </p>

                        {error && (
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                                <p className="text-amber-800 text-sm">
                                    <strong>Note:</strong> Using fallback content due to connection issues.
                                </p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </section>
    )
}

export default AboutUs
