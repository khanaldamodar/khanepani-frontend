'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditDocumentPage() {
  const { id } = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    subject: '',
    type: '',
    file: null as File | null,
  });

  const [currentFile, setCurrentFile] = useState('');
  const [errors, setErrors] = useState<{ subject?: string; type?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    const res = await axios.get(`${apiUrl}documents/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
    

      console.log(res.data);
      setForm({ subject: res.data.subject, type: res.data.type, file: null });
      setCurrentFile(res.data.file);
    };

    if (id) fetchDocument();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm((prev) => ({ ...prev, file }));
  };

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.type.trim()) newErrors.type = 'Type is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const formData = new FormData();
    formData.append('subject', form.subject);
    formData.append('type', form.type);
    if (form.file) {
      formData.append('file', form.file);
    }

    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL
      const res = await fetch(`${apiUrl}documents/${id}`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        alert('Document updated!');
        router.push('/admin/documents/all');
      } else {
        alert('Update failed');
      }
    } catch (err) {
      alert('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow font-poppins">
      <h2 className="text-xl font-semibold mb-6">Edit Document</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 font-medium text-sm">Subject</label>
          <input
            type="text"
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
          {errors.subject && <p className="text-sm text-red-600">{errors.subject}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Type</label>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select Type</option>
            <option value="notice">Notice</option>
            <option value="report">Report</option>
            <option value="other">Others</option>
          </select>
          {errors.type && <p className="text-sm text-red-600">{errors.type}</p>}
        </div>

        <div>
          <label className="block mb-1 font-medium text-sm">Upload New File (optional)</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
            className="w-full"
          />
          {currentFile && (
            <a
              href={`${process.env.NEXT_PUBLIC_IMAGE_URL}${currentFile}`}
              target="_blank"
              className="text-sm text-blue-600 underline block mt-1"
            >
              View Current File
            </a>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          {loading ? 'Updating...' : 'Update Document'}
        </button>
      </form>
    </div>
  );
}
