"use client";

import { useState } from "react";

export default function ContactPage() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setLoading(true);

    // ✅ Optional: Send to backend API
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}contacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed");
      setSuccess(true);
      setForm({ first_name: "", last_name: "", phone_number: "", email: "", message: "" });
    } catch (err) {
      alert("Failed to send message.");
    }

    setTimeout(() => {
      setSuccess(true);
      setForm({ first_name: "", last_name: "", phone_number: "", email: "", message: "" });
      setLoading(false);
    }, 1000); // Fake delay for demo
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="w-12 h-12 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 font-poppins">
      <h2 className="text-3xl font-bold mb-6 text-center">Contact Us</h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded-lg">
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block font-medium mb-1">First Name *</label>
            <input
              type="text"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              required
              placeholder="Enter your first name"
              className="w-full border px-4 py-2 rounded"
            />
          </div>
          <div className="w-1/2">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              required
              placeholder="Enter your last name"
              className="w-full border px-4 py-2 rounded"
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Phone *</label>
          <input
            type="tel"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            required
            placeholder="Enter your phone_number number"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            placeholder="Enter your email address"
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Message *</label>
          <textarea
            name="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
            placeholder="Enter your message"
            className="w-full border px-4 py-2 rounded"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>

        {success && (
          <p className="text-green-600 mt-2 font-medium">Your message has been sent!</p>
        )}
      </form>
    </div>
  );
}
