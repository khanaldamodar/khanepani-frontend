"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Cookies from "js-cookie"; // Ensure you have js-cookie installed
import { useRouter } from "next/navigation";

interface Gallery {
  id: number;
  title: string;
  images: string[]; // Array of image paths (from Laravel)
  category: string;
  created_at: string;
}

export default function GalleryList() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [filterTitle, setFilterTitle] = useState("");
  const router = useRouter();


  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const token = Cookies.get("token"); // Assuming you have a way to get the token from cookies or context
      const res = await fetch(`${apiUrl}gallery`, {
        headers: {
          Authorization: `Bearer ${token}`, // Replace with your actual token
        },
      });
      const data = await res.json();
      setGalleries(data);
    } catch (error) {
      console.error("Failed to load galleries", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const token = Cookies.get("token");
      const res = await fetch(`${apiUrl}gallery/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setGalleries((prev) => prev.filter((item) => item.id !== id));
      } else {
        const error = await res.json();
        alert(error.message || "Delete failed.");
      }
    } catch (err) {
      alert("Delete error.");
    }
  };

  const filteredGalleries = galleries.filter((g) =>
    g.title.toLowerCase().includes(filterTitle.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 font-poppins">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Gallery List</h2>
        <input
          type="text"
          placeholder="Search by title"
          value={filterTitle}
          onChange={(e) => setFilterTitle(e.target.value)}
          className="border px-3 py-1 rounded"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">Created</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredGalleries.map((gallery) => (
              <tr key={gallery.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{gallery.title}</td>
                <td className="px-4 py-3">{gallery.category || "-"} </td>
                <td className="px-4 py-3 flex gap-2">
                  {gallery.images.slice(0, 2).map((img, i) => (
                    <img
                      key={i}
                      src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                      alt="gallery"
                      className="h-10 w-10 object-cover rounded"
                    />
                  ))}
                  {gallery.images.length > 2 && (
                    <span className="text-gray-500 text-xs">+{gallery.images.length - 2} more</span>
                  )}
                </td>
                <td className="px-4 py-3">{new Date(gallery.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-3">
                  {/* <button title="View">
                    <Eye className="h-5 w-5 text-blue-600 hover:text-blue-800" />
                  </button> */}
                  <button title="Edit"   onClick={() => router.push(`/admin/gallery/add?id=${gallery.id}`)}>
                    <Pencil className="h-5 w-5 text-yellow-600 hover:text-yellow-800" />
                  </button>
                  <button title="Delete" onClick={() => handleDelete(gallery.id)}>
                    <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredGalleries.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center py-6 text-gray-500">
                  No gallery items found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
