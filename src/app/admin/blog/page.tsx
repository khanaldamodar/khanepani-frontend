"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Post {
  id: number;
  title: string;
  image: string | null;
  content: string;
  created_at: string;
}

export default function BlogListPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [filterTitle, setFilterTitle] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const token = Cookies.get("token")
      const res = await fetch(`${apiUrl}posts`, {
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual token
        },
      });
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error("Failed to fetch posts", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = Cookies.get("token") 
      const res = await fetch(`${apiUrl}posts/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((post) => post.id !== id));
        toast.success("Blog Deleted Successfully")
      } else {
        const err = await res.json();
        alert(err.message || "Delete failed");
      }
    } catch (err) {
      alert("Failed to delete post");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(filterTitle.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <input
          type="text"
          placeholder="Search by title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Image</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPosts.map((post) => (
              <tr key={post.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {post.image ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${post.image}`}
                      alt={post.title}
                      className="h-10 w-10 object-cover rounded"
                    />
                  ) : (
                    <span className="text-xs text-gray-400">No Image</span>
                  )}
                </td>
                <td className="px-4 py-3">{post.title}</td>
                <td className="px-4 py-3">
                  {new Date(post.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 flex gap-3">
                  {/* <button title="View">
                    <Eye className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                  </button> */}
                  <button title="Edit" onClick={() => router.push(`/admin/blog/add?id=${post.id}`)}>
                    <Pencil className="h-5 w-5 text-yellow-600 hover:text-yellow-800" />
                  </button>
                  <button title="Delete" onClick={() => handleDelete(post.id)}>
                    <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredPosts.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
