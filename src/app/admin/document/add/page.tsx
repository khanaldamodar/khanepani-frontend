"use client";

import { useState } from "react";
import Cookies from "js-cookie";

export default function AddDocumentPage() {
  const [form, setForm] = useState({
    subject: "",
    type: "",
    file: null as File | null,
  });

  const [errors, setErrors] = useState<{
    subject?: string;
    type?: string;
    file?: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.subject.trim()) newErrors.subject = "Subject is required";
    if (!form.type.trim()) newErrors.type = "Type is required";
    if (!form.file) newErrors.file = "File is required";
    else if (
      ![
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ].includes(form.file.type)
    ) {
      newErrors.file = "Only PDF, DOC, and DOCX files are allowed";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const formData = new FormData();
    formData.append("subject", form.subject);
    formData.append("type", form.type);
    formData.append("file", form.file!);

    setLoading(true);
    setSuccess(false);

    try {
      const token = Cookies.get("token");
      const res = await fetch("http://127.0.0.1:8000/api/documents", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Replace `yourToken` with the actual token variable
        },
        body: formData,
      });

      if (res.ok) {
        setSuccess(true);
        setForm({ subject: "", type: "", file: null });
        (document.getElementById("file") as HTMLInputElement).value = "";
      } else {
        const err = await res.json();
        alert(err.message || "Something went wrong");
      }
    } catch (error) {
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow rounded-md font-poppins">
      <h2 className="text-xl font-semibold mb-6">Upload Document</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          />
          {errors.subject && (
            <p className="text-sm text-red-600">{errors.subject}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring"
          >
            <option value="">Select Type</option>
            <option value="notice">Notice</option>
            <option value="report">Report</option>
          </select>
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">File</label>
          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="w-full"
          />
          {errors.file && <p className="text-sm text-red-600">{errors.file}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Uploading..." : "Upload Document"}
        </button>

        {success && (
          <p className="text-green-600 text-sm text-center">
            Document uploaded successfully!
          </p>
        )}
      </form>
    </div>
  );
}
