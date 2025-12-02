"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Eye, Trash } from "lucide-react";

interface Contact {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  message: string;
  created_at: string;
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchContacts = async () =>
    {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}contacts`);
        setContacts(res.data.data);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setLoading(false);
      }
    };

    const handleDelete = async (id: number) => {
      if (!confirm("Are you sure you want to delete this contact message?")) {
        return;
      }
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}contacts/${id}`);
            setContacts(contacts.filter(contact => contact.id !== id));
        } catch (error) {
            console.error("Failed to delete contact:", error);
        }
    }

  useEffect(() => {
    fetchContacts();
  }, []);

  return (
    <div className="p-6 font-poppins">
      <h1 className="text-2xl font-semibold mb-4">Contact Messages</h1>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading...</p>}

      {/* Table */}
      {!loading && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">ID</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Created At</th>
                <th className="p-3 border">Actions</th>

              </tr>
            </thead>

            <tbody>
              {contacts.map((contact) => (
                <tr key={contact.id} className="text-center">
                  <td className="p-3 border">{contact.id}</td>
                  <td className="p-3 border">
                    {contact.first_name} {contact.last_name}
                  </td>
                  <td className="p-3 border">{contact.email}</td>
                  <td className="p-3 border">{contact.phone_number}</td>
                  <td className="p-3 border">{contact.message}</td>
                  <td className="p-3 border">
                    {new Date(contact.created_at).toLocaleString()}
                  </td>
                  <td className="p-3 border flex items-center justify-center gap-3">

                    <Trash onClick={()=> handleDelete(contact.id)} size={20} className="text-red-600 cursor-pointer"/>
                    {/* <Eye  size={20} className="text-blue-600 cursor-pointer"/> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {contacts.length === 0 && (
            <p className="text-center text-gray-500 mt-4">No contacts found.</p>
          )}
        </div>
      )}
    </div>
  );
}
