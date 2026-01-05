"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function AddMember() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const editId = searchParams.get("id");

  const [form, setForm] = useState({
    name: "",
    number: "",
    position: "",
    type: "board",
    photo: null as File | null,
    transition_period_id: null as number | null,
  });
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [transitionPeriods, setTransitionPeriods] = useState<{ id: number, name: string, start_date: number, end_date: number | null }[]>([]);

  useEffect(() => {
    const fetchTransitionPeriods = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = Cookies.get("token");
        const res = await fetch(`${apiUrl}transition-periods`, {
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
        });
        const data = await res.json();
        setTransitionPeriods(data);
      } catch (err) {
        toast.error("Failed to load transition periods.");
      }
    };

    fetchTransitionPeriods();

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
            transition_period_id: data.transition_period_id
              ? Number(data.transition_period_id)
              : null,
          });

          setPreview(process.env.NEXT_PUBLIC_IMAGE_URL + data.photo);
        } catch {
          toast.error("Failed to load member details.");
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

      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        formData.append(key, value as any);
      }
    });

    if (editId) formData.append("_method", "PUT");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = Cookies.get("token");

      const res = await fetch(
        editId ? `${apiUrl}members/${editId}` : `${apiUrl}members`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          body: formData,
        }
      );

      if (res.ok) {
        toast.success(editId ? "Member updated" : "Member added");
        editId ? router.push("/admin/members") : location.reload();
      } else {
        const err = await res.json();
        toast.error(err.message || "Something went wrong");
      }
    } catch {
      toast.error("Failed to save member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white rounded-2xl shadow-lg border font-poppins">
      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-800 text-center">
          {editId ? "Edit Member" : "Add New Member"}
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Fill the details below
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Image Preview */}
        {preview && (
          <div className="flex justify-center">
            <img
              src={preview}
              className="w-28 h-28 rounded-full object-cover border shadow"
              alt="Preview"
            />
          </div>
        )}

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Photo</label>
          <input
            type="file"
            id="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm border rounded-lg file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:bg-blue-50 file:text-blue-600
              hover:file:bg-blue-100"
          />
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Full Name" placeholder="Enter full name" name="name" value={form.name} onChange={handleChange} />
          <Input label="Phone Number" placeholder="Enter phone number" name="number" value={form.number} onChange={handleChange} />
          <Input label="Position" placeholder="Enter position" name="position" value={form.position} onChange={handleChange} />

          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              required
              name="type"
              value={form.type}
              onChange={handleChange}
              className="input border w-full px-4 py-2 rounded-lg"
            >
              <option value="board">Board</option>
              <option value="staff">Staff</option>
              <option value="advisor">Advisor</option>
              <option value="lekha">Lekha Samittee</option>
              <option value="plan_committee">Water Safety Plan Committee</option>
            </select>
          </div>


        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Transition Period</label>
          <select
            name="transition_period_id"
            value={form.transition_period_id ?? ""}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                transition_period_id: e.target.value ? Number(e.target.value) : null
              }))
            }
            required
            className="input border w-full px-4 py-2 rounded-lg"
          >
            <option value="">Select a period</option>
            {transitionPeriods.map((period) => (
              <option key={period.id} value={period.id}>
                {period.name} ({period.start_date}-{period.end_date || "Present"})
              </option>
            ))}
          </select>

        </div>


        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-xl text-white font-medium
            bg-gradient-to-r from-blue-600 to-indigo-600
            hover:opacity-90 transition disabled:opacity-60"
        >
          {loading ? "Saving..." : editId ? "Update Member" : "Add Member"}
        </button>
      </form>
    </div>
  );
}

/* Reusable Input */
function Input({ label, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-4 py-2
        focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
