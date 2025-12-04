// components/NavbarClient.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X, Search, Download } from "lucide-react";
import { useRouter } from "next/navigation";

interface NavbarData {
  name: string;
  address: string;
  logo: string;
  form: string;
}

export default function Navbar({ data }: { data: NavbarData }) {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);


  const aboutRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);


  const toggleDropdown = (menu: string) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setOpenMenu("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    router.push(`/search?keyword=${encodeURIComponent(searchQuery.trim())}`);
  };

  const handleDownload = () => {
    router.push(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.form}`);
  };

  // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        aboutRef.current &&
        !aboutRef.current.contains(e.target as Node) &&
        resourcesRef.current &&
        !resourcesRef.current.contains(e.target as Node)
      ) {
        setOpenMenu("");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);


  return (
    <div className="w-full border-b shadow-sm bg-white font-poppins relative">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <img
            src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.logo}`}
            alt="Logo"
            className="h-12 w-12 sm:h-14 sm:w-14 object-contain flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {data.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 leading-tight">
              {data.address}
            </p>
          </div>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Download */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Download size={16} />
            Download Form
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 ml-2"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6 px-6 py-3 border-t text-sm font-medium bg-blue-600 text-white">
        <Link href="/" className="hover:text-blue-200">
          Home
        </Link>

        {/* ABOUT US */}
        <div className="relative flex items-center gap-1" ref={aboutRef}>
          {/* Text → go to /about */}
          <Link href="/about" className="hover:text-blue-200">
            About Us
          </Link>

          {/* Arrow → open dropdown */}
          <button
            onClick={() => toggleDropdown("about")}
            className="hover:text-blue-200"
          >
            <ChevronDown size={14} />
          </button>

          {/* Dropdown */}
          {openMenu === "about" && (
            <div className="absolute left-0 top-8 w-48 bg-blue-600 shadow-lg rounded-md z-20 border">
              <Link
                href="/members/board-members"
                className="block px-4 py-3 text-white  hover:text-blue-200"
              >
                Board Members
              </Link>
              <Link
                href="/members/staffs"
                className="block px-4 py-3 text-white  hover:text-blue-200 border-t"
              >
                Staffs
              </Link>
            </div>
          )}
        </div>

        <Link href="/resources/notices" className="hover:text-blue-200">
          Notices
        </Link>

        {/* RESOURCES */}
        <div className="relative flex items-center gap-1" ref={resourcesRef}>
          <span className="cursor-pointer hover:text-blue-200">Resources</span>
          <button
            onClick={() => toggleDropdown("resources")}
            className="hover:text-blue-200"
          >
            <ChevronDown size={14} />
          </button>

          {openMenu === "resources" && (
            <div className="absolute left-0 top-10 w-48 bg-blue-600 shadow-lg rounded-md border z-20">
              <Link
                href="/resources/reports"
                className="block px-4 py-3  text-white hover:text-blue-200"
              >
                Reports
              </Link>
              <Link
                href="/resources/downloads"
                className="block px-4 py-3 text-white border-t hover:text-blue-200"
              >
                Downloads
              </Link>
            </div>
          )}
        </div>

        <Link href="/gallery" className="hover:text-blue-200">
          Gallery
        </Link>
        <Link href="/blogs" className="hover:text-blue-200">
          Blogs
        </Link>
        <Link href="/contact" className="hover:text-blue-200">
          Contact Us
        </Link>
      </nav>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-600 border-t absolute top-full left-0 right-0 z-30 shadow-lg">
          <div className="px-4 py-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">

            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full px-3 py-2 text-sm border border-blue-400 rounded-md bg-white"
                />
              </div>
            </form>

            <button
              onClick={handleDownload}
              className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md text-sm"
            >
              <Download size={16} />
              Download Form
            </button>

            <Link href="/" className="block px-3 py-2 text-white" onClick={closeMobileMenu}>
              Home
            </Link>

            {/* MOBILE ABOUT */}
            <div className="bg-blue-700 rounded-md">
              <div className="flex justify-between items-center">
                <Link
                  href="/about"
                  onClick={closeMobileMenu}
                  className="px-3 py-2 text-white flex-1"
                >
                  About Us
                </Link>
                <button
                  onClick={() => toggleDropdown("about")}
                  className="px-3 py-2 text-white"
                >
                  <ChevronDown
                    size={16}
                    className={`${openMenu === "about" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {openMenu === "about" && (
                <div className="ml-4 space-y-1 py-2">
                  <Link
                    href="/members/board-members"
                    onClick={closeMobileMenu}
                    className="block text-blue-100 px-3 py-2"
                  >
                    Board Members
                  </Link>
                  <Link
                    href="/members/staffs"
                    onClick={closeMobileMenu}
                    className="block text-blue-100 px-3 py-2"
                  >
                    Staffs
                  </Link>
                </div>
              )}
            </div>

            {/* MOBILE RESOURCES */}
            <div className="bg-blue-700 rounded-md">
              <div className="flex justify-between items-center">
                <span className="px-3 py-2 text-white flex-1">Resources</span>
                <button
                  onClick={() => toggleDropdown("resources")}
                  className="px-3 py-2 text-white"
                >
                  <ChevronDown
                    size={16}
                    className={`${openMenu === "resources" ? "rotate-180" : ""}`}
                  />
                </button>
              </div>

              {openMenu === "resources" && (
                <div className="ml-4 space-y-1 py-2">
                  <Link
                    href="/resources/reports"
                    onClick={closeMobileMenu}
                    className="block text-blue-100 px-3 py-2"
                  >
                    Reports
                  </Link>
                  <Link
                    href="/resources/downloads"
                    onClick={closeMobileMenu}
                    className="block text-blue-100 px-3 py-2"
                  >
                    Downloads
                  </Link>
                </div>
              )}
            </div>

            <Link href="/gallery" className="block px-3 py-2 text-white" onClick={closeMobileMenu}>
              Gallery
            </Link>
            <Link href="/blogs" className="block px-3 py-2 text-white" onClick={closeMobileMenu}>
              Blogs
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-white" onClick={closeMobileMenu}>
              Contact Us
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Background Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}
