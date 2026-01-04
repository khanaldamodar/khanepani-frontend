"use client";

import { useEffect, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Member {
  id: number;
  name: string;
  number: string;
  position: string;
  type: "board" | "staff";
  photo: string; // URL to the image
  joining_date: string;
  leaving_date: string;
  transition_period: {
    start_date: string;
    end_date: string;
  };
}

export default function MembersList() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [filter, setFilter] = useState<"all" | "board" | "staff">("all");
  const [search, setSearch] = useState(""); // 🔹 search state
  const imageUrl = process.env.NEXT_PUBLIC_IMAGE_URL;

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const token = Cookies.get("token");
        const res = await fetch(`${apiUrl}members`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch members");
        const data = await res.json();
        setMembers(data);
      } catch (error) {
        console.error("Failed to fetch members:", error);
      }
    };

    fetchMembers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const token = Cookies.get("token");
      const res = await fetch(`${apiUrl}members/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setMembers((prev) => prev.filter((m) => m.id !== id));
        toast.success("Member Deleted Successfully")
      } else {
        const err = await res.json();
        // alert(err.message || "Delete failed.");
        toast.error(err.message || "Delete failed.");
      }
    } catch (error) {
      // alert("Delete request failed.");
      toast.error("Delete request failed.");
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/members/add?id=${id}`);
  };

  // 🔹 Combined filtering: by type + search
  const filteredMembers = members.filter((member) => {
    const matchesType = filter === "all" || member.type === filter;
    const matchesSearch = member.name
      .toLowerCase()
      .includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-poppins">
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between justify-between sm:items-center mb-4">
        <h2 className="text-2xl font-bold">Members List</h2>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* 🔹 Search by name */}
          <input
            type="text"
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border px-3 py-1 rounded w-full sm:w-60"
          />

          {/* 🔹 Filter by type */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border px-3 py-1 rounded"
          >
            <option value="all">All</option>
            <option value="board">Board</option>
            <option value="staff">Staff</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left">Photo</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Number</th>
              <th className="px-4 py-3 text-left">Position</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Transition Period</th> {/* 🔹 Added */}
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredMembers.map((member) => (
              <tr key={member.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">
                  {member.photo ? (
                    <img
                      src={`${imageUrl}${member.photo}`}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs">
                      N/A
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">{member.name}</td>
                <td className="px-4 py-3">{member.number}</td>
                <td className="px-4 py-3">{member.position}</td>
                <td className="px-4 py-3 capitalize">{member.type}</td>

                {/* 🔹 Transition Period */}
                <td className="px-4 py-3">
                  {member.transition_period
                    ? `${member.transition_period.start_date} - ${member.transition_period.end_date ?? "Present"}`
                    : "N/A"}
                </td>

                <td className="px-4 py-3 flex items-center gap-3">
                  <button title="Edit" onClick={() => handleEdit(member.id)}>
                    <Pencil className="h-5 w-5 text-yellow-600 hover:text-yellow-800" />
                  </button>
                  <button title="Delete" onClick={() => handleDelete(member.id)}>
                    <Trash2 className="h-5 w-5 text-red-600 hover:text-red-800" />
                  </button>
                </td>
              </tr>
            ))}
            {filteredMembers.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-6 text-gray-500">
                  No members found.
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
