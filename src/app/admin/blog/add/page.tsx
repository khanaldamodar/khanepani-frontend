"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams } from "next/navigation";

export default function AddPost() {
  const searchParams = useSearchParams();
  const postId = searchParams.get("id"); // null if adding new post

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch existing post data if editing
  useEffect(() => {
    if (postId) {
      const fetchPost = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL
          const token = Cookies.get("token") || "";
          const res = await fetch(`${apiUrl}posts/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          });
          const data = await res.json();
          setTitle(data.title);
          setContent(data.content);
          if (data.image) {
            setPreviewImage(`${process.env.NEXT_PUBLIC_IMAGE_URL}public/storage/${data.image}`);
          }
        } catch (err) {
          console.error("Failed to fetch post data", err);
        }
      };
      fetchPost();
    }
  }, [postId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImage(e.target.files[0]);
      setPreviewImage(URL.createObjectURL(e.target.files[0])); // preview new image
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const token = Cookies.get("token") || "";
      const url = postId
        ? `${apiUrl}posts/${postId}`
        : `${apiUrl}posts`;

      const method = postId ? "POST" : "POST"; // Laravel PUT via FormData needs `_method`
      if (postId) {
        formData.append("_method", "PUT");
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        if (!postId) {
          setTitle("");
          setContent("");
          setImage(null);
          setPreviewImage(null);
          (document.getElementById("image") as HTMLInputElement).value = "";
        }
      } else {
        const err = await res.json();
        alert(err.message || "Failed to save post");
      }
    } catch (error) {
      alert("Post save failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-10 px-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-6">
        {postId ? "Edit Blog Post" : "Write a Blog Post"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {previewImage && (
          <img
            src={previewImage}
            alt="Preview"
            className="h-24 w-auto rounded object-cover"
          />
        )}

        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border px-4 py-2 rounded"
        />

        <textarea
          rows={10}
          placeholder="Write your blog content here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading
            ? postId
              ? "Updating..."
              : "Publishing..."
            : postId
            ? "Update Post"
            : "Publish Post"}
        </button>

        {success && (
          <p className="text-green-600 mt-2 font-medium">
            {postId ? "Post updated successfully!" : "Post created successfully!"}
          </p>
        )}
      </form>
    </div>
  );
}
