"use client"
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";

interface CompanyDetails {
  address: string;
  email: string;
  phone: string;
  google_earth_link?: string;
  map_location?: string;
}



export default function Footer() {

  const [details, setDetails] = useState<CompanyDetails>({
    address: "",
    email: "",
    phone: "",
    google_earth_link: "",
    map_location: "",
  });
  useEffect(() => {
    // Fetch footer details from an API or database
    const fetchDetails = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}settings`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: CompanyDetails = await response.json();
        setDetails(data)
        console.log("Footer Details:", data);
      } catch (error) {
        console.error("Failed to fetch footer details:", error);
      }
    };

    fetchDetails();
  }, []);

  const getMapUrl = () => {
    // 1. If we have a Google Earth link, parse it
    if (details.google_earth_link) {
      const earthRegex = /@([-\d.]+),([-\d.]+)/;
      const match = details.google_earth_link.match(earthRegex);
      if (match && match[1] && match[2]) {
        // Return an embeddable satellite view from Google Maps using these coordinates
        return `https://maps.google.com/maps?q=${match[1]},${match[2]}&t=k&z=17&output=embed`;
      }
    }

    // 2. Fallback to map_location if it's already an embed URL
    if (details.map_location?.includes("google.com/maps/embed")) {
      return details.map_location;
    }

    // 3. Fallback to hardcoded default (Gagangauda Khanepani area)
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d84.08510787!3d28.13052323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xabcdef123456!2sYour+Place!5e0!3m2!1sen!2snp!4v1689156789123!5m2!1sen!2snp";
  };
  return (
    <footer className="bg-blue-900 text-white font-poppins">
      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-bold mb-4">Contact Us</h3>
          <div className="flex items-start gap-2 mb-2">
            <MapPin size={18} />
            <p>{details.address}</p>
          </div>
          <div className="flex items-start gap-2 mb-2">
            <Mail size={18} />
            <p>{details.email}</p>
          </div>
          <div className="flex items-start gap-2 mb-2">
            <Phone size={18} />
            <p>{details.phone}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <a href="#" className="hover:text-gray-300">
              <Facebook size={20} />
            </a>
            <a href="#" className="hover:text-gray-300">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        {/* Office Hours */}
        <div>
          <h3 className="text-lg font-bold mb-4">Office Hours</h3>
          <p className="font-semibold">Summer:</p>
          <p className="mb-2 text-sm">Sunday - Friday: 10:00 AM - 5:00 PM</p>

          <p className="font-semibold">Winter:</p>
          <p className="text-sm">Sunday - Friday: 10:00 AM - 4:00 PM</p>
        </div>

        {/* Important Links */}
        <div>
          <h3 className="text-lg font-bold mb-4">Important Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-gray-300">Home</Link></li>
            <li><Link href="/about/board-members" className="hover:text-gray-300">Board Members</Link></li>
            <li><Link href="/gallery" className="hover:text-gray-300">Gallery</Link></li>
            <li><Link href="/blogs" className="hover:text-gray-300">Blogs</Link></li>
            <li><Link href="/contact" className="hover:text-gray-300">Contact Us</Link></li>
          </ul>
        </div>

        {/* Map */}
        <div>
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Globe size={20} className="text-blue-400" />
            Location Map
          </h3>
          <div className="relative group">
            <iframe
              src={getMapUrl()}
              width="100%"
              height="200"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="rounded-lg shadow-inner bg-blue-950"
            />

            {details.google_earth_link && (
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg">
                <a
                  href={details.google_earth_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-blue-900 px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 transform hover:scale-105 transition-transform"
                >
                  <Globe size={16} />
                  Open in Google Earth
                  <ExternalLink size={14} />
                </a>
              </div>
            )}
          </div>

          {details.google_earth_link && (
            <div className="mt-3">
              <a
                href={details.google_earth_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-300 hover:text-white flex items-center gap-1 transition-colors"
              >
                <Globe size={12} />
                
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="text-center py-4 bg-blue-950 text-sm text-white/70">
        © {new Date().getFullYear()} Gagangauda Khanepani. All rights reserved. Developed by <Link className="text-green-600" href={'#'}>WashTech</Link>.
      </div>
    </footer>
  );
}
