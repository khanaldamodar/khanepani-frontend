"use client"
import { useEffect, useState } from "react"
import { Users, Target, Heart, Award } from "lucide-react"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const AboutUs = () => {
    const [aboutUs, setAboutUs] = useState<string>("")
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    useEffect(() => {
        const fetchAboutUs = async () => {
            try {
                setLoading(true)
                const apiUrl = process.env.NEXT_PUBLIC_API_URL
                const response = await fetch(`${apiUrl}settings`)

                if (!response.ok) {
                    throw new Error("Failed to fetch about us data")
                }

                const data = await response.json()
                setAboutUs(
                    data.about ||
                    "We are passionate about creating exceptional experiences and building meaningful connections with our community.",
                )
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong")
                // Fallback content
                setAboutUs(
                    "We are passionate about creating exceptional experiences and building meaningful connections with our community. Our team is dedicated to innovation, quality, and making a positive impact in everything we do.",
                )
            } finally {
                setLoading(false)
            }
        }

        fetchAboutUs()
    }, [])

    if (loading) {
        return (
            <div className="min-h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div className="relative overflow-hidden bg-[#FFFADA] py-5 px-6 font-poppins">
            {/* Background decoration */}
            {/* <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-10"></div>
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-gradient-to-tr from-emerald-400/20 to-blue-600/20 rounded-full blur-3xl -z-10"></div> */}

            <div className="max-w-3xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg">
                        <Users className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
                        About Us
                    </h1>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="gap-12 items-center mb-16">
                    <div className="space-y-6">
                        <p className="text-lg leading-relaxed text-slate-700 font-medium">{aboutUs}</p>
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
        </div>
    )
}

export default AboutUs
