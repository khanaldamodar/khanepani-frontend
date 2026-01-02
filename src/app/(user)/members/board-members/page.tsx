// app/members/board-members/page.tsx
"use client";
import MemberCard from "@/components/global/IndividualMember";
import Loader from "@/components/global/Loader";
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

const POSITION_ORDER = [
  "अध्यक्ष",
  "उपाध्याक्ष",
  "सचिब",
  "कोषाधक्ष्य",
  "सहसचिब",
  "सहकोषाधक्ष्य",
];

export default function BoardMembersPage() {
  const [data, setData] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"present" | "previous">("present");

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}members`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const jsonData: Member[] = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Failed to fetch board members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Filter out staff
  const nonStaffMembers = data.filter((m) => m.type !== "staff");

  // Split into Present and Previous based on activeTab
  const currentTabMembers = nonStaffMembers.filter((m) => {
    const today = new Date();
    // Reset time for date-only comparison
    today.setHours(0, 0, 0, 0);

    const lDateStr = m.leaving_date?.trim();
    const lDate = lDateStr ? new Date(lDateStr) : null;

    // Present if: No leaving date OR leaving date is in the future
    const isPresent = !lDate || lDate > today;

    return activeTab === "present" ? isPresent : !isPresent;
  });

  // Categorize
  const boardMembers = currentTabMembers.filter((m) => m.type === "board");
  const advisors = currentTabMembers.filter((m) => m.type === "advisor");
  const lekhaSamittee = currentTabMembers.filter((m) => m.type === "lekha");
  const planCommittee = currentTabMembers.filter((m) => m.type === "plan_committee");

  // Sort Board Members by position priority
  const getPriority = (pos: string) => {
    const index = POSITION_ORDER.indexOf(pos.trim());
    return index === -1 ? 999 : index;
  };

  const sortedBoard = [...boardMembers].sort(
    (a, b) => getPriority(a.position) - getPriority(b.position)
  );

  // Split board into rows for the layout
  const firstRow = sortedBoard.slice(0, 1);
  const secondRow = sortedBoard.slice(1, 4);
  const thirdRow = sortedBoard.slice(4, 6);
  const otherBoard = sortedBoard.slice(6);

  const hasData = currentTabMembers.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins">
      <h2 className="text-3xl font-bold mb-8 text-center">Board Members & Committees</h2>

      {/* Tabs */}
      <div className="flex justify-center mb-12 border-b">
        <button
          onClick={() => setActiveTab("present")}
          className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "present"
            ? "border-b-4 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
            }`}
        >
          Present Members
        </button>
        <button
          onClick={() => setActiveTab("previous")}
          className={`px-6 py-2 font-semibold transition-colors duration-300 ${activeTab === "previous"
            ? "border-b-4 border-blue-600 text-blue-600"
            : "text-gray-500 hover:text-blue-500"
            }`}
        >
          Previous Members
        </button>
      </div>

      {!hasData ? (
        <div className="py-20">
          <NoDataFound />
        </div>
      ) : (
        <div className="space-y-20">

          {/* SECTION: BOARD MEMBERS */}
          {sortedBoard.length > 0 && (
            <div className="space-y-12">
              <h3 className="text-2xl font-bold text-center text-blue-800 underline underline-offset-8">
                Board Members
              </h3>

              <div className="space-y-4">
                {/* Row 1: Top (1 member) */}
                {firstRow.length > 0 && (
                  <div className="flex justify-center">
                    <div className="w-full max-w-sm">
                      <MemberCard {...firstRow[0]} />
                    </div>
                  </div>
                )}

                {/* Row 2: (3 members) */}
                {secondRow.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center items-center">
                    {secondRow.map((member, index) => (
                      <div key={index} className="flex justify-center">
                        <div className="w-full max-w-sm">
                          <MemberCard {...member} />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Row 3: (2 members) */}
                {thirdRow.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-8">
                    {thirdRow.map((member, index) => (
                      <div key={index} className="w-full max-w-sm sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-2rem)] lg:w-[calc(25%-2rem)] min-w-[300px]">
                        <MemberCard {...member} />
                      </div>
                    ))}
                  </div>
                )}

                {/* Others Board: Normal Grid */}
                {otherBoard.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t">
                    {otherBoard.map((member, index) => (
                      <MemberCard key={index} {...member} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SECTION: ADVISORS */}
          {advisors.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center text-blue-800 underline underline-offset-8">
                Advisors
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {advisors.map((member, index) => (
                  <MemberCard key={index} {...member} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION: LEKHA SAMITTEE */}
          {lekhaSamittee.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center text-blue-800 underline underline-offset-8">
                Lekha Samittee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {lekhaSamittee.map((member, index) => (
                  <MemberCard key={index} {...member} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION: PLAN COMMITTEE */}
          {planCommittee.length > 0 && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-center text-blue-800 underline underline-offset-8">
                Water Safety Plan Committee
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {planCommittee.map((member, index) => (
                  <MemberCard key={index} {...member} />
                ))}
              </div>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
