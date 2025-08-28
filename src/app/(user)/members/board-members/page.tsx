// app/members/page.tsx
"use client";
import NoDataFound from "@/components/global/DataNotFound";
import MemberCard from "@/components/global/IndividualMember";
import React , {useState, useEffect} from "react";

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

  const [boardMembers, setStaffs] = useState<Member[]>([]);

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
        const filteredData = data.filter((item) => item.type === "board");
        console.log("Filtered Staffs:", filteredData);
        setStaffs(filteredData);
      } catch (error) {
        console.error("Failed to fetch staffs:", error);
      }
    };

    fetchStaffs();
  }, []);


  if(boardMembers.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:py-40">
        <NoDataFound/>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Members</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {boardMembers.map((member, index) => (
          <MemberCard key={index} {...member} />
        ))}
      </div>
    </div>
  );
}
