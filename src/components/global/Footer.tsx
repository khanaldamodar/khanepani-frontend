"use client"
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import React, {useState, useEffect} from "react";

interface CompanyDetails{
  address: string;
  email: string;
  phone: string;
}



export default function Footer() {

  const [details, setDetails] = useState<CompanyDetails[]>([]);
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
        const data:CompanyDetails[] = await response.json();
        setDetails(data)
        console.log("Footer Details:", data);
        setDetails(data);
      } catch (error) {
        console.error("Failed to fetch footer details:", error);
      }
    };

    fetchDetails();
  }, []);
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
          <h3 className="text-lg font-bold mb-4">Location Map</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.8336839614746!2d83.04477631438506!3d27.696650332928306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399687505e0086ab%3A0x8d5f3156a9a3ff4e!2sBuddhabhumi!5e0!3m2!1sen!2snp!4v1693478924696!5m2!1sen!2snp"
            width="100%"
            height="200"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            className="rounded"
          ></iframe>
        </div>
      </div>

      <div className="text-center py-4 bg-blue-950 text-sm text-white/70">
        © {new Date().getFullYear()} Shakta Khanepani. All rights reserved.
      </div>
    </footer>
  );
}
