"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Create = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState(""); // Updated to use categoryId
  const [categories, setCategories] = useState([]); // State to hold categories
  const router = useRouter(); // ใช้ useRouter เพื่อเปลี่ยนเส้นทางหลังจากสร้างโพสต์เสร็จ

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      axios.post("/api/posts", {
        title,
        content,
        categoryId, // ส่ง categoryId แทน category
      });
      router.push("/"); // เปลี่ยนเส้นทางไปยังหน้าแรกหลังจากสร้างโพสต์เสร็จ
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get("/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  // เพิ่มส่วนดึง category ออกมา
  useEffect(() => {
    // Fetch categories when the component mounts
    fetchCategories();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Create a New Post</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            value={title} // Bind title state to input
            onChange={(e) => setTitle(e.target.value)} // Update title state
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            Content
          </label>
          <textarea
            name="content"
            id="content"
            value={content} // Bind content state to textarea
            onChange={(e) => setContent(e.target.value)} // Update content state
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create;
