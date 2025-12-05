// app/members/page.tsx
"use client";

import NoDataFound from "@/components/global/DataNotFound";
import MemberCard from "@/components/global/IndividualMember";
import React, { useState, useEffect } from "react";

interface Member {
  name: string;
  position: string;
  number: string;
  photo: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export default function MembersPage() {

  const [staffs, setStaffs] = useState<Member[]>([]);

    const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch staff data from an API or database
    const fetchStaffs = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}members`
        );

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Member[] = await response.json();
        const filteredData = data.filter((item) => item.type === "staff");
        console.log("Filtered Staffs:", filteredData);
        setStaffs(filteredData);
      } catch (error) {
        console.error("Failed to fetch staffs:", error);
      }finally{
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



  if (staffs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-40 font-poppins">
        <NoDataFound />
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {staffs.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}
