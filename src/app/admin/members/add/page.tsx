"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";

export default function AddMember() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    type: "board",
    photo: null as File | null, // for new file
  });

  const [preview, setPreview] = useState<string | null>(null); // 🔹 preview for both edit & upload
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fetch data if editing
  useEffect(() => {
    if (editId) {
      const fetchMember = async () => {
        try {
          const apiUrl = process.env.NEXT_PUBLIC_API_URL;
          const token = Cookies.get("token");
          const res = await fetch(`${apiUrl}members/${editId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();

          setForm({
            name: data.name,
            number: data.number,
            position: data.position,
            type: data.type,
            photo: null,
          });

          // 🔹 Set preview with existing image
          setPreview(process.env.NEXT_PUBLIC_IMAGE_URL + data.photo);
        } catch (error) {
          alert("Failed to load member details.");
        }
      };
      fetchMember();
    }
  }, [editId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setForm((prev) => ({ ...prev, photo: file }));

      // 🔹 Create local preview for uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("number", form.number);
    formData.append("position", form.position);
    formData.append("type", form.type);
    if (form.photo) formData.append("photo", form.photo);
    if (editId) formData.append("_method", "PUT");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = Cookies.get("token");
      const res = await fetch(
        editId ? `${apiUrl}members/${editId}` : `${apiUrl}members`,
        {
          method: "POST", // Laravel expects POST (with _method override)
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      if (res.ok) {
        setSuccess(true);
        if (!editId) {
          setForm({
            name: "",
            number: "",
            position: "",
            type: "board",
            photo: null,
          });
          setPreview(null);
          (document.getElementById("photo") as HTMLInputElement).value = "";
        } else {
          router.push("/admin/members"); // Redirect after update
        }
      } else {
        const error = await res.json();
        alert(error.message || "Something went wrong.");
      }
    } catch (error) {
      alert("Failed to save member.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-md rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {editId ? "Edit Member" : "Add Member"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        {/* 🔹 Preview + File Upload */}
        {preview && (
          <div className="mb-2 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-full border"
            />
          </div>
        )}
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handleFileChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="number"
          placeholder="Phone Number"
          value={form.number}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="position"
          placeholder="Position"
          value={form.position}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded"
        />

        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        >
          <option value="board">Board</option>
          <option value="staff">Staff</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading
            ? editId
              ? "Updating..."
              : "Adding..."
            : editId
            ? "Update Member"
            : "Add Member"}
        </button>

        {success && (
          <p className="text-green-600 text-center mt-2">
            Saved successfully!
          </p>
        )}
      </form>
    </div>
  );
}
