"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";

export default function BlogListPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}posts`);
        console.log("Fetched blogs:", response.data);
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };
    fetchBlogs();
  }, []);

  const getFullImageUrl = (imgPath: string | null) => {
    const baseUrl = process.env.NEXT_PUBLIC_IMAGE_URL;
    return imgPath ? `${baseUrl}${imgPath}` : "/default-image.jpg"; // fallback image
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h2 className="text-3xl font-bold mb-6 text-center">Our Blog</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog: any) => (
          <Link
            key={blog.id}
            href={`/blogs/${blog.slug ?? blog.id}`}
            className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition"
          >
            <img
              src={getFullImageUrl(blog.image)}
              alt={blog.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{blog.title}</h3>
              <p className="text-sm text-gray-500 mb-2">
                {new Date(blog.created_at).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-700 line-clamp-2">
                {blog.content.slice(0, 100)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
