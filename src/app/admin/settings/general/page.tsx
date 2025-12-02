"use client";

import { useState, useEffect } from "react";
import { Upload, User, MapPin, Mail, Phone, Facebook, Twitter, Instagram, Save, Check, FileText } from "lucide-react";
import Cookie from "js-cookie";
export default function GeneralSettingsPage() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    facebook: "",
    twitter: "",
    about:""
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pdf, setPdf] = useState<File | null>(null); // ✅ new state
  const [pdfPreview, setPdfPreview] = useState<string | null>(null);

  // 🔁 Fetch existing settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = Cookie.get("token");
        const res = await fetch(`${apiUrl}settings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        setForm(data);

        if (data.logo) {
          setLogoPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.logo}`);
        }

        if (data.form) {
          setPdfPreview(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.form}`);
        }
      } catch (err) {
        console.error("Failed to load settings", err);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPdf(file);
      setPdfPreview(URL.createObjectURL(file)); // temporary preview
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    // Simulate API call for demo
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
    }, 1500);


    const formData = new FormData();
    formData.append("_method", "PUT");
    formData.append("name", form.name);
    formData.append("address", form.address);
    formData.append("email", form.email);
    formData.append("phone", form.phone);
    formData.append("facebook", form.facebook);
    formData.append("twitter", form.twitter);
    formData.append("about", form.about);

    if (logo) formData.append("logo", logo);
    if (pdf) formData.append("form", pdf);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = Cookie.get("token");
      const res = await fetch(`${apiUrl}settings`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
          "Accept": "application/json",

        },
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
      } else {
        const err = await res.json();
        alert(err.message || "Update failed");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <User className="mr-3" size={24} />
              Company Information
            </h2>
          </div>




          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Logo Upload */}
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <Upload className="mr-2" size={18} />
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {logoPreview && (
                      <img
                        src={logoPreview}
                        alt="Logo Preview"
                        className="h-16 w-16 object-cover rounded-lg shadow-md border-2 border-white"
                      />
                    )}
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <User className="mr-2" size={18} />
                    Company Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="Enter company name"
                    required
                  />
                </div>

                {/* Address */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <MapPin className="mr-2" size={18} />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="Enter company address"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Email */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Mail className="mr-2" size={18} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Phone className="mr-2" size={18} />
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="Enter phone number"
                  />
                </div>
                {/* PDF Upload */}
                <div className="bg-gray-50 p-6 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
                  <label className=" text-sm font-semibold text-gray-700 mb-3 flex items-center">
                    <FileText className="mr-2" size={18} />
                    Upload PDF Form
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handlePdfChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                    />
                    {pdfPreview && (
                      <a
                        href={pdfPreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        View PDF
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* About Section */}
            <div className="mt-10">
              <div className="flex items-center mb-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <h3 className="px-4 text-lg font-semibold text-gray-700">About Company</h3>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <textarea
                name="about"
                value={form.about}
                onChange={(e) => setForm({ ...form, about: e.target.value })}
                rows={6}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm resize-none"
                placeholder="Write a short description about the company..."
              ></textarea>
            </div>


            {/* Social Media Section */}
            <div className="mt-10">
              <div className="flex items-center mb-6">
                <div className="h-px bg-gray-300 flex-1"></div>
                <h3 className="px-4 text-lg font-semibold text-gray-700">Social Media Links</h3>
                <div className="h-px bg-gray-300 flex-1"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Facebook */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Facebook className="mr-2 text-blue-600" size={18} />
                    Facebook
                  </label>
                  <input
                    type="url"
                    name="facebook"
                    value={form.facebook}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>

                {/* Twitter */}
                <div>
                  <label className=" text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Twitter className="mr-2 text-sky-500" size={18} />
                    Twitter
                  </label>
                  <input
                    type="url"
                    name="twitter"
                    value={form.twitter}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none transition-colors bg-white shadow-sm"
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </div>
            </div>

            {/* Submit Section */}
            <div className="mt-10 pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
                {success && (
                  <div className="flex items-center text-green-600 font-medium bg-green-50 px-4 py-2 rounded-lg">
                    <Check className="mr-2" size={18} />
                    Settings updated successfully!
                  </div>
                )}

                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`
                    flex items-center px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200 shadow-lg
                    ${loading
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
                    }
                  `}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2" size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}