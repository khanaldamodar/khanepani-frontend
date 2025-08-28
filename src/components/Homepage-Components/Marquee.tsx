"use client";
import { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import Link from "next/link";

interface DocumentItem {
  id: number;
  title: string;
}
export default function MarqueeBanner() {
  const [notices, setNotices] = useState<DocumentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); 
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const fetchNotices = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}posts`);
        const data: DocumentItem[] = await res.json();
        setNotices(data);
        
      } catch (error) {
        console.error("Failed to fetch notices:", error);
      }finally{
        setIsLoading(false);
      }
    };

    fetchNotices();
  }, []);



  if (notices.length === 0) {
  return (
    <div className="bg-white flex items-center gap-4 py-2 px-4 border-b border-gray-200 font-poppins">
      <span className="font-semibold text-blue-700 whitespace-nowrap">📢 Notices:</span>
      <span className="text-sm text-gray-500">Loading...</span>
    </div>
  );
}
return (
    <div className="bg-white flex items-center gap-4 py-2 px-4 border-b border-gray-200 font-poppins">
      <span className="font-semibold text-blue-700 whitespace-nowrap">
        📢 Notices:
      </span>
      {isLoading ? (
        // Render a placeholder or empty marquee while loading
        <div className="flex-1 animate-pulse bg-gray-200 rounded h-4"></div>
      ) : notices.length === 0 ? (
        <span className="text-sm font-medium text-gray-500">No new notices.</span>
      ) : (
        <Marquee
          gradient={false}
          speed={50}
          pauseOnHover={true}
          className="text-sm font-medium text-gray-800 flex-1"
        >
          {notices.map((notice, idx) => (
            <span key={notice.id} className="mx-4 whitespace-nowrap">
              🔔{" "}
              <Link href={`/blogs/${notice.id}`} className="hover:underline text-blue-600">
                {notice.title}
              </Link>
              {idx !== notices.length - 1 && " | "}
            </span>
          ))}
        </Marquee>
      )}
    </div>
  );
  
}
