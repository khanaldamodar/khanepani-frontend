'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Document {
  id: number;
  subject: string;
  type: string;
  file: string; // filename or URL
}

export default function AllDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(""); // 🔹 search input state

  useEffect(() => {
    // Replace this with your real API call
    const fetchDocuments = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}documents`);
      const data = await res.json();
      setDocuments(data);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this document?');
    if (!confirmDelete) return;

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${apiUrl}documents/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
         return toast.success("Document Deleted Successfully")
      } else {
        
        toast.error("Failed to delete document");
      }
    } catch (err) {
      toast.error("Error occurred while deleting document");
      // alert('Error occurred while deleting');
    }
  };

  // 🔹 Filter documents based on search term
  const filteredDocuments = documents.filter((doc) =>
    doc.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.file.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 font-poppins">
      <h2 className="text-2xl font-semibold mb-6">All Documents</h2>

      {/* 🔹 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by subject, type, or file..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 border px-4 py-2 rounded shadow-sm"
        />
      </div>

      {loading ? (
        <p>Loading documents...</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full bg-white border rounded shadow">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="text-left p-3">#</th>
                <th className="text-left p-3">Subject</th>
                <th className="text-left p-3">Type</th>
                <th className="text-left p-3">File</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((doc, index) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{doc.subject}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3">
                      <a
                        href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${doc.file}`}
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        {doc.file}
                      </a>
                    </td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/admin/document/edit/${doc.id}`}
                        className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center p-4 text-gray-500">
                    No documents found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
