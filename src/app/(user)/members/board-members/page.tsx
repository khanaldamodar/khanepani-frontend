// app/members/board-members/page.tsx
"use client";
import MemberCard from "@/components/global/IndividualMember";
import NoDataFound from "@/components/global/DataNotFound";
import React, { useState, useEffect } from "react";

interface TransitionPeriod {
  id: number;
  name: string;
  start_date: number;
  end_date: number;
  created_at: string;
  updated_at: string;
}

interface Member {
  id: number;
  transition_period_id: number;
  name: string;
  photo: string | null;
  number: string;
  position: string;
  type: string;
  joining_date: string | null;
  leaving_date: string | null;
  created_at: string;
  updated_at: string;
  transition_period: TransitionPeriod;
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
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"present" | "previous">("present");

  const [previousMember, setPreviousMember] = useState<Member[]>([])



  useEffect(() => {

    const getPreviousChairPersonOnly = async () => {

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}members`)

      const data = await res.json()
      console.log("Previous Member Data", data)

    }

    getPreviousChairPersonOnly()


  }, [])

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}members`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: Member[] = await response.json();
        setMembers(data);
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
  const nonStaffMembers = members.filter((m) => m.type !== "staff");

  // Group members by transition period
  const groupedByPeriod: { [key: number]: { period: TransitionPeriod; members: Member[] } } = {};
  nonStaffMembers.forEach((member) => {
    const periodId = member.transition_period_id;
    if (!groupedByPeriod[periodId]) {
      groupedByPeriod[periodId] = {
        period: member.transition_period,
        members: [],
      };
    }
    groupedByPeriod[periodId].members.push(member);
  });

  // Sort periods by start_date descending
  const sortedPeriodIds = Object.keys(groupedByPeriod)
    .map(Number)
    .sort((a, b) => groupedByPeriod[b].period.start_date - groupedByPeriod[a].period.start_date);

  const latestPeriodId = sortedPeriodIds[0];
  const previousPeriodIds = sortedPeriodIds.slice(1);
  const immediatePreviousPeriodId = sortedPeriodIds[1];

  // Find immediate previous chairperson (Chairman or अध्यक्ष)
  let previousChairperson: Member | undefined;
  if (immediatePreviousPeriodId && groupedByPeriod[immediatePreviousPeriodId]) {
    previousChairperson = groupedByPeriod[immediatePreviousPeriodId].members.find(
      (m) => m.position === "Chairman" || m.position === "अध्यक्ष"
    );
  }

  const getPriority = (pos: string) => {
    const index = POSITION_ORDER.indexOf(pos.trim());
    return index === -1 ? 999 : index;
  };

  const renderMemberSection = (periodMembers: Member[], prevChairperson?: Member) => {
    const boardMembers = periodMembers.filter((m) => m.type === "board");
    const advisors = periodMembers.filter((m) => m.type === "advisor");
    const lekhaSamittee = periodMembers.filter((m) => m.type === "lekha");
    const planCommittee = periodMembers.filter((m) => m.type === "plan_committee");

    const sortedBoard = [...boardMembers].sort(
      (a, b) => getPriority(a.position) - getPriority(b.position)
    );

    const firstRow = sortedBoard.slice(0, 1);
    const secondRow = sortedBoard.slice(1, 4);
    const thirdRow = sortedBoard.slice(4, 6);
    const otherBoard = sortedBoard.slice(6);

    return (
      <div className="space-y-20">
        {/* SECTION: BOARD MEMBERS */}
        {sortedBoard.length > 0 && (
          <div className="space-y-12">
            <h3 className="text-2xl font-bold text-center text-blue-800 underline underline-offset-8">
              Board Members
            </h3>

            <div className="space-y-4">
              {firstRow.length > 0 && (
                <div className="flex flex-col md:flex-row justify-center gap-8 items-center">
                  {/* Current Chairperson */}
                  <div className="w-full max-w-sm">
                    <MemberCard photo={firstRow[0].photo || ""} name={firstRow[0].name} number={firstRow[0].number} position={firstRow[0].position} />
                  </div>

                  {/* Immediate Previous Chairperson (Only shown if passed) */}
                  {prevChairperson && (
                    <div className="w-full max-w-sm">
                      <div className="relative">
                        <div className="absolute -top-3 left-0 right-0 text-center z-10">
                          <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full border border-gray-200">
                            Immediate Past Chairperson
                          </span>
                        </div>
                        <MemberCard
                          photo={prevChairperson.photo || ""}
                          name={prevChairperson.name}
                          number={prevChairperson.number || ""}
                          position={prevChairperson.position}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {secondRow.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center items-center">
                  {secondRow.map((member, index) => (
                    <div key={index} className="flex justify-center">
                      <div className="w-full max-w-sm">
                        <MemberCard photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {thirdRow.length > 0 && (
                <div className="flex flex-wrap justify-center gap-8">
                  {thirdRow.map((member, index) => (
                    <div key={index} className="w-full max-w-sm sm:w-[calc(50%-1rem)] md:w-[calc(33.333%-2rem)] lg:w-[calc(25%-2rem)] min-w-[300px]">
                      <MemberCard photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
                    </div>
                  ))}
                </div>
              )}

              {otherBoard.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t">
                  {otherBoard.map((member, index) => (
                    <MemberCard key={index} photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
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
                <MemberCard key={index} photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
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
                <MemberCard key={index} photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
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
                <MemberCard key={index} photo={member.photo || ""} name={member.name} number={member.number} position={member.position} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 font-poppins text-slate-800">
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

      {activeTab === "present" ? (
        latestPeriodId ? (
          <div>
            <div className="text-center mb-10">
              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold text-lg">
                Transition Period: {groupedByPeriod[latestPeriodId].period.start_date} - {groupedByPeriod[latestPeriodId].period.end_date}
              </span>
            </div>
            {renderMemberSection(groupedByPeriod[latestPeriodId].members, previousChairperson)}
          </div>
        ) : (
          <NoDataFound />
        )
      ) : (
        <div className="space-y-24">
          {previousPeriodIds.length > 0 ? (
            previousPeriodIds.map((id) => (
              <div key={id} className="border-t pt-10">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-800 mb-2">
                    Transition Period: {groupedByPeriod[id].period.start_date} - {groupedByPeriod[id].period.end_date}
                  </h3>
                  <div className="w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
                </div>
                {renderMemberSection(groupedByPeriod[id].members)}
              </div>
            ))
          ) : (
            <NoDataFound />
          )}
        </div>
      )}
    </div>
  );
}
