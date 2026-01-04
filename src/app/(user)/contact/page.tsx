"use client";

import { useState, useEffect } from "react";
import { MapPin, Phone, Mail, Globe, ExternalLink } from "lucide-react";

interface CompanyDetails {
  address: string;
  email: string;
  phone: string;
  google_earth_link?: string;
  map_location?: string;
}

export default function ContactPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [details, setDetails] = useState<CompanyDetails>({
    address: "",
    email: "",
    phone: "",
    google_earth_link: "",
    map_location: "",
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}settings`);
        if (response.ok) {
          const data = await response.json();
          setDetails(data);
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const getMapUrl = () => {
    if (details.google_earth_link) {
      const earthRegex = /@([-\d.]+),([-\d.]+)/;
      const match = details.google_earth_link.match(earthRegex);
      if (match && match[1] && match[2]) {
        return `https://maps.google.com/maps?q=${match[1]},${match[2]}&t=k&z=17&output=embed`;
      }
    }
    if (details.map_location?.includes("google.com/maps/embed")) {
      return details.map_location;
    }
    return "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.123456789!2d84.08510787!3d28.13052323!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xabcdef123456!2sYour+Place!5e0!3m2!1sen!2snp!4v1689156789123!5m2!1sen!2snp";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    // ✅ Optional: Send to backend API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm({ first_name: "", last_name: "", phone_number: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message.");
    }

    setTimeout(() => {
      setSuccess(true);
      setForm({ first_name: "", last_name: "", phone_number: "", email: "", message: "" });
      setLoading(false);
    }, 1000); // Fake delay for demo
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 font-poppins text-slate-800">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-blue-900 mb-4">Contact Us</h2>
        <p className="text-gray-600 max-w-2xl mx-auto italic">
          We are here to help and answer any questions you might have. We look forward to hearing from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* LEFT: FORM */}
        <div className="bg-white p-8 shadow-2xl rounded-2xl border border-blue-50">
          <h3 className="text-2xl font-bold mb-6 text-blue-800">Send us a Message</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-2">First Name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  placeholder="John"
                  className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block font-semibold text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  required
                  placeholder="98XXXXXXXX"
                  className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
              <div>
                <label className="block font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="john@example.com"
                  className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-2">Message *</label>
              <textarea
                name="message"
                rows={6}
                value={form.message}
                onChange={handleChange}
                required
                placeholder="How can we help you?"
                className="w-full border-2 border-gray-100 px-4 py-3 rounded-xl focus:border-blue-500 focus:outline-none transition-all shadow-sm resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-blue-700 hover:shadow-lg transition-all transform hover:-translate-y-1"
            >
              {loading ? "Sending Message..." : "Send Message Now"}
            </button>

            {success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center font-medium border border-green-200">
                Your message has been sent successfully! We will get back to you soon.
              </div>
            )}
          </form>
        </div>

        {/* RIGHT: MAP & CONTACT INFO */}
        <div className="space-y-8">
          <div className="bg-white p-4 shadow-2xl rounded-2xl border border-blue-50 overflow-hidden group">
            <h3 className="text-2xl font-bold mb-6 px-4 pt-4 text-blue-800 flex items-center gap-2">
              <Globe className="text-blue-500" />
              Visit Our Office
            </h3>
            <div className="relative rounded-xl overflow-hidden shadow-inner bg-slate-100">
              <iframe
                src={getMapUrl()}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                className="w-full"
              />

              {details.google_earth_link && (
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                  <a
                    href={details.google_earth_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white text-blue-900 px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 hover:scale-110 transition-transform"
                  >
                    <Globe size={20} />
                    Open Google Earth
                    <ExternalLink size={16} />
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <MapPin className="text-blue-600 mb-3" size={28} />
              <h4 className="font-bold text-blue-900">Address</h4>
              <p className="text-sm text-gray-600">{details.address || "Gagangauda, Pokhara"}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <Phone className="text-blue-600 mb-3" size={28} />
              <h4 className="font-bold text-blue-900">Phone</h4>
              <p className="text-sm text-gray-600">{details.phone || "+977 XXX XXXXXX"}</p>
            </div>
            <div className="bg-blue-50 p-6 rounded-2xl flex flex-col items-center text-center">
              <Mail className="text-blue-600 mb-3" size={28} />
              <h4 className="font-bold text-blue-900">Email</h4>
              <p className="text-sm text-gray-600 break-all">{details.email || "info@khanepani.com"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
