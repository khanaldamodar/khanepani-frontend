"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

interface Post {
  id: number;
  title: string;
  content: string;
}

export default function SearchComponent() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("keyword");
  const [results, setResults] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) return;
      setLoading(true);
      setResults([]);
      setMessage("");

      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const res = await fetch(`${apiUrl}posts/search?keyword=${keyword}`);
        const data = await res.json();

        if (!res.ok || data.status === false) {
          setMessage(data.message || "No data found.");
          setResults([]);
        } else {
          setResults(data.results || []);
        }
      } catch (error) {
        setMessage("Something went wrong while searching.");
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [keyword]);

  return (
      <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">
        Search Results for "{keyword}"
      </h1>

      {loading && <p className="text-blue-500">Loading...</p>}
      {!loading && message && <p className="text-red-500">{message}</p>}
      {!loading && !message && results.length === 0 && (
        <p className="text-gray-500">No posts found.</p>
      )}

      <ul className="space-y-2 mt-4">
        {results.map((post) => (
          <li key={post.id} className="border p-3 rounded shadow">
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-sm">{post.content.slice(0, 100)}...</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
