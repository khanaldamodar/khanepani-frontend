// components/NavbarClient.tsx
"use client";
import { useState } from "react";
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
    router.push(`${process.env.NEXT_PUBLIC_IMAGE_URL}${data.form}`)

  };

  return (
    <div className="w-full border-b shadow-sm bg-white font-poppins relative">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo and Organization Info */}
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

        {/* Right Side Actions - Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Bar */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearch} className="flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="px-3 py-2 pr-10 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowSearch(false)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-md transition-colors"
                title="Search"
              >
                <Search size={20} />
              </button>
            )}
          </div>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            <Download size={16} />
            Download Form
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors ml-2"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation Bar */}
      <nav className="hidden md:flex gap-6 px-6 py-3 border-t text-sm font-medium bg-blue-600 text-white">
        <Link href="/" className="hover:text-blue-200 transition-colors">
          Home
        </Link>

        <div className="relative group">
          <button
            onClick={() => toggleDropdown("about")}
            className="flex items-center gap-1 hover:text-blue-200 transition-colors"
          >
            About Us <ChevronDown size={14} />
          </button>
          {openMenu === "about" && (
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20 border">
              <Link
                href="/members/board-members"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setOpenMenu("")}
              >
                Board Members
              </Link>
              <Link
                href="/members/staffs"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t"
                onClick={() => setOpenMenu("")}
              >
                Staffs
              </Link>
            </div>
          )}
        </div>

        <Link href="/resources/notices" className="hover:text-blue-200 transition-colors">
          Notices
        </Link>

        <div className="relative group">
          <button
            onClick={() => toggleDropdown("resources")}
            className="flex items-center gap-1 hover:text-blue-200 transition-colors"
          >
            Resources <ChevronDown size={14} />
          </button>
          {openMenu === "resources" && (
            <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md z-20 border">
              <Link
                href="/resources/reports"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                onClick={() => setOpenMenu("")}
              >
                Reports
              </Link>
              <Link
                href="/resources/downloads"
                className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-t"
                onClick={() => setOpenMenu("")}
              >
                Downloads
              </Link>
            </div>
          )}
        </div>

        <Link href="/gallery" className="hover:text-blue-200 transition-colors">
          Gallery
        </Link>
        <Link href="/blogs" className="hover:text-blue-200 transition-colors">
          Blogs
        </Link>
        <Link href="/contact" className="hover:text-blue-200 transition-colors">
          Contact Us
        </Link>
      </nav>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-blue-600 border-t absolute top-full left-0 right-0 z-30 shadow-lg">
          <div className="px-4 py-3 space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {/* Mobile Search */}
            <div className="pb-3 border-b border-blue-500">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-3 py-2 text-sm border border-blue-400 rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent bg-white"
                  />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                </div>
              </form>
              {/* Mobile Download Button */}
              <button
                onClick={handleDownload}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 bg-white text-blue-600 rounded-md hover:bg-blue-50 transition-colors text-sm font-medium"
              >
                <Download size={16} />
                Download Form
              </button>
            </div>

            {/* Navigation Links */}
            <Link
              href="/"
              className="block px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Mobile About Us Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown("about")}
                className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                About Us
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-200 ${
                    openMenu === "about" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openMenu === "about" ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/members/board-members"
                    className="block px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md transition-colors text-sm"
                    onClick={closeMobileMenu}
                  >
                    Board Members
                  </Link>
                  <Link
                    href="/members/staffs"
                    className="block px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md transition-colors text-sm"
                    onClick={closeMobileMenu}
                  >
                    Staffs
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/resources/notices"
              className="block px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Notices
            </Link>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() => toggleDropdown("resources")}
                className="flex items-center justify-between w-full px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Resources
                <ChevronDown 
                  size={16} 
                  className={`transform transition-transform duration-200 ${
                    openMenu === "resources" ? "rotate-180" : ""
                  }`}
                />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${
                openMenu === "resources" ? "max-h-32 opacity-100" : "max-h-0 opacity-0"
              }`}>
                <div className="ml-4 mt-1 space-y-1">
                  <Link
                    href="/resources/reports"
                    className="block px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md transition-colors text-sm"
                    onClick={closeMobileMenu}
                  >
                    Reports
                  </Link>
                  <Link
                    href="/resources/downloads"
                    className="block px-3 py-2 text-blue-100 hover:bg-blue-700 rounded-md transition-colors text-sm"
                    onClick={closeMobileMenu}
                  >
                    Downloads
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href="/gallery"
              className="block px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Gallery
            </Link>
            <Link
              href="/blogs"
              className="block px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Blogs
            </Link>
            <Link
              href="/contact"
              className="block px-3 py-2 text-white hover:bg-blue-700 rounded-md transition-colors"
              onClick={closeMobileMenu}
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0  bg-opacity-25 z-20 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </div>
  );
}