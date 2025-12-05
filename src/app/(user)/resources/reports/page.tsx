"use client";
import Table from "@/components/global/Table";
import { useState, useEffect } from "react";

const headings = ["Subject", "File"];

interface Report {
  id: number;
  subject: string;
  file: string;
  type: string;
  created_at: string;
  updated_at?: string;
}

export default function MembersPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchReports = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}documents`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Report[] = await response.json();
      const filteredReports = data.filter((item) => item.type === "report");
      console.log("Filtered reports:", filteredReports);

      setReports(filteredReports);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    }finally{
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format reports for table
  const formattedData = reports.map((report) => ({
    subject: report.subject,
    file: (
      <a
        href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${report.file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {`${report.subject}.pdf`}
      </a>
    ),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 font-poppins">
      <h2 className="text-2xl font-bold mb-6">Reports</h2>

      <Table headings={headings} data={formattedData} />
    </div>
  );
}
