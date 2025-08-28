'use client';

import { useEffect, useState } from 'react';

import Link from 'next/link';



interface Document {
  id: number;
  subject: string;
  type: string;
  file: string; // filename or URL
}


export default function AllDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Replace this with your real API call
    const fetchDocuments = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}documents`);
      const data = await res.json();
      console.log(data);
      setDocuments(data);
      setLoading(false);
    };

    fetchDocuments();
  }, []);

  const handleDelete = async (id: number) => {
    const confirm = window.confirm('Are you sure you want to delete this document?');
    if (!confirm) return;

    try {
       const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}documents/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setDocuments((prev) => prev.filter((doc) => doc.id !== id));
      } else {
        alert('Failed to delete');
      }
    } catch (err) {
      alert('Error occurred while deleting');
    }
  };

  return (
    <div className="p-4 font-poppins">
      <h2 className="text-2xl font-semibold mb-6">All Documents</h2>

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
                 {/* <th className="text-left p-3">Date</th> */}
                <th className="text-left p-3">File</th>
                           
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.length > 0 ? (
                documents.map((doc, index) => (
                  <tr key={doc.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3">{doc.subject}</td>
                    <td className="p-3">{doc.type}</td>
                    <td className="p-3">
                      <a
                        href={`${process.env.NEXT_PUBLIC_IMAGE_URL}public/storage/${doc.file}`}
                        className="text-blue-600 underline"
                        target="_blank"
                      >
                        {doc.file}
                      </a>
                    </td>
                    <td className="p-3 space-x-2">
                      <Link
                        href={`/admin/documents/edit/${doc.id}`}
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
