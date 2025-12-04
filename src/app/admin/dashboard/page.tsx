"use client";

import { useEffect, useState } from "react";
import { Edit3, Plus, Users, Image } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from 'next/navigation'
import Loader from "@/components/global/Loader";

interface DashboardData {
  total_staffs: number;
  total_board_members: number;
  total_contacts: number;
  total_blogs: number;
  total_documents: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${apiUrl}dashboard`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      const json = await res.json();

      if (res.ok) {
        setData(json);
      } else {
        console.error("API Error:", json);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

 
  return (
    <div className="flex-1 p-8 font-poppins">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome to Admin Dashboard
        </h2>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">

          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-blue-500">
            <h4 className="text-gray-600 text-sm">Total Staffs</h4>
            <p className="text-3xl font-bold text-gray-800">
              {data?.total_staffs}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-purple-500">
            <h4 className="text-gray-600 text-sm">Board Members</h4>
            <p className="text-3xl font-bold text-gray-800">
              {data?.total_board_members}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-green-500">
            <h4 className="text-gray-600 text-sm">Contacts</h4>
            <p className="text-3xl font-bold text-gray-800">
              {data?.total_contacts}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-orange-500">
            <h4 className="text-gray-600 text-sm">Blogs</h4>
            <p className="text-3xl font-bold text-gray-800">
              {data?.total_blogs}
            </p>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-md border-l-4 border-red-500">
            <h4 className="text-gray-600 text-sm">Documents</h4>
            <p className="text-3xl font-bold text-gray-800">
              {data?.total_documents}
            </p>
          </div>

        </div>

        {/* Quick Actions Section */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

            <button className="flex items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200" onClick={() => router.push('/admin/document/add')}>
              <Plus size={20} className="mr-2" />
              Add Document
            </button>

            <button className="flex items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200" onClick={() => router.push('/admin/blog/add')}>
              <Edit3 size={20} className="mr-2" />
              New Post
            </button>

            <button className="flex items-center justify-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors duration-200" onClick={() => router.push('/admin/gallery/add')}>
              <Image size={20} className="mr-2" />
              Upload Image
            </button>

            <button className="flex items-center justify-center p-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-200" onClick={() => router.push('/admin/members/add')}>
              <Users size={20} className="mr-2" />
              Add Member
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
