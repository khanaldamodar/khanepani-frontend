// app/members/staffs/page.tsx
"use client";
import MemberCard from "@/components/global/IndividualMember";
import NoDataFound from "@/components/global/DataNotFound";
import React, { useState, useEffect } from "react";

interface Member {
  name: string;
  position: string;
  number: string;
  photo: string;
  type: string;
  joining_date?: string;
  leaving_date?: string;
  created_at?: string;
  updated_at?: string;
}

export default function StaffsPage() {
  const [presentStaff, setPresentStaff] = useState<Member[]>([]);
  const [previousStaff, setPreviousStaff] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"present" | "previous">("present");

  useEffect(() => {
    const fetchStaffs = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}members`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Member[] = await response.json();

        // Filter for staff members
        const staffs = data.filter((item) => item.type === "staff");

        // Split into present and previous
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const present = staffs.filter(m => {
          const lDateStr = m.leaving_date?.trim();
          const lDate = lDateStr ? new Date(lDateStr) : null;
          return !lDate || lDate > today;
        });

        const previous = staffs.filter(m => {
          const lDateStr = m.leaving_date?.trim();
          const lDate = lDateStr ? new Date(lDateStr) : null;
          return lDate && lDate <= today;
        });

        setPresentStaff(present);
        setPreviousStaff(previous);
      } catch (error) {
        console.error("Failed to fetch staffs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStaffs();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentList = activeTab === "present" ? presentStaff : previousStaff;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Staff</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-8 border-b">
        <button
          onClick={() => setActiveTab("present")}
          className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "present"
            ? "border-b-4 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
            }`}
        >
          Present Staff
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "previous"
            ? "border-b-4 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
            }`}
        >
          Previous Staff
        </button>
      </div>

      {currentList.length === 0 ? (
        <div className="py-20">
          <NoDataFound />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {currentList.map((member, index) => (
            <MemberCard key={index} {...member} />
          ))}
        </div>
      )}
    </div>
  );
}
