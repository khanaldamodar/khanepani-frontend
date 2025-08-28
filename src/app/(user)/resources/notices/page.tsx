"use client";
import Table from "@/components/global/Table";
import { useEffect, useState } from "react";
const headings = ["subject", "File"];
const data = [
  { subject: "Ram Bahadur", file: "Manager" },
  { subject: "Sita Kumari", file: "Accountant" },
];
interface Notices {
  id: number;
  subject: string;
  file: string;
  type: string;
  created_at: string;
  updated_at?: string;
}

export default function MembersPage() {
  const [notices, setNotices] = useState<Notices[]>([]);

  const fetchNotices = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}documents`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data: Notices[] = await response.json();
      const filteredNotices = data.filter((item) => item.type === "notice");
      console.log("Filtered Notices:", filteredNotices);

      setNotices(filteredNotices);
    } catch (error) {
      console.error("Failed to fetch Notices:", error);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  // Format Notices for table
  const formattedData = notices.map((notice) => ({
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
