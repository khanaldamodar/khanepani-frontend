"use client";

import Table from "@/components/global/Table";
import { useEffect, useState } from "react";
const headings = ["subject", "File"];
const data = [
  { subject: "Ram Bahadur", file: "Manager" },
  { subject: "Sita Kumari", file: "Accountant" },
];
interface Documents {
  id: number;
  subject: string;
  file: string;
  type: string;
  created_at: string;
  updated_at?: string;
}

export default function MembersPage() {
  const [document, setDocuments] = useState<Documents[]>([]);
  const[loading, setLoading] = useState<boolean>(true);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}documents`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Documents[] = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error("Failed to fetch Documents:", error);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);


  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format Notices for table
  const formattedData = document.map((notice) => ({

    subject: notice.subject,
    file: (
      <a
        href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${notice.file}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        {`${notice.subject}.pdf`}
      </a>
    ),
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6">Notices / सूचना</h2>

      <Table headings={headings} data={formattedData} />
    </div>
  );
}
