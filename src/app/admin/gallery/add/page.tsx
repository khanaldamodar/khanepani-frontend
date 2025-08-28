"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

export default function AddGallery() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [images, setImages] = useState<FileList | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [existingImages, setExistingImages] = useState<string[]>([]); // for showing current images
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch data if editing
  useEffect(() => {
    if (id) {
      const fetchGallery = async () => {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL
        const token = Cookies.get("token");
        const res = await fetch(`${apiUrl}gallery/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTitle(data.title);
        setCategory(data.category);
        setExistingImages(data.images || []);
      };
      fetchGallery();
    }
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);

    if (images) {
      Array.from(images).forEach((image) => {
        formData.append("images[]", image);
      });
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = Cookies.get("token");
      const url = id
        ? `${apiUrl}gallery/${id}`
        : `${apiUrl}gallery`;
      const method = id ? "POST" : "POST"; // If Laravel uses PUT for update, adjust accordingly
      if (id) formData.append("_method", "PUT"); // Laravel's method spoofing

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        toast.success("Images Added Successfully")
        if (!id) {
          setTitle("");
          setCategory("");
          setImages(null);
          (document.getElementById("images") as HTMLInputElement).value = "";
        }
      } else {
        const err = await res.json();
        // alert(err.message || "Failed to save gallery");
        // toast.error(err.message || "Failed to save gallery")
      }
    } catch (err) {
      // alert("Error saving gallery");
      toast.error("Error saving gallery")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-xl shadow font-poppins">
      <h2 className="text-2xl font-semibold mb-6">
        {id ? "Edit Gallery Item" : "Add Gallery Item"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Gallery Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        >
          <option value="" disabled>
            Select category
          </option>
          <option value="awards">Awards</option>
          <option value="activity">Activity</option>
          <option value="banner">Banner</option>
          <option value="others">Others</option>
        </select>

        {id && existingImages.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((img, i) => (
              <img
                key={i}
                src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                alt="existing"
                className="h-16 w-16 object-cover rounded"
              />
            ))}
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Saving..." : id ? "Update" : "Upload"}
        </button>

        {success && (
          <p className="text-green-600 font-medium">
            {id ? "Gallery updated successfully!" : "Gallery uploaded successfully!"}
          </p>
        )}
      </form>
    </div>
  );
}
