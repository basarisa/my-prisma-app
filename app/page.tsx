"use client"; // ใช้ use client เพื่อให้สามารถใช้ useEffect ได้

import React, { useEffect, useState } from "react";
import axios from "axios"; // ใช้ axios ในการทำ HTTP request เชื่อมต่อกับ API
import Link from "next/link"; // ใช้ Link จาก next/link เพื่อทำการเชื่อมโยงไปยังหน้าอื่นๆ

export default function Home() {
  const [posts, setPosts] = useState([]); // สร้าง state สำหรับเก็บโพสต์
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sort, setSort] = useState("desc");


  const fetchPosts = async () => {
    try {
      const query = new URLSearchParams({category,search,sort}).toString(); // สร้าง query string สำหรับการค้นหา
      const response = await axios.get(`/api/posts?${query}`); // ทำการเรียก API เพื่อดึงข้อมูลโพสต์
      setPosts(response.data); // เก็บข้อมูลโพสต์ใน state
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`/api/categories`); // ทำการเรียก API เพื่อดึงข้อมูลโพสต์
      setCategories(response.data); // เก็บข้อมูลโพสต์ใน state
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const deletePost = async (id: number) => {
    try {
      await axios.delete(`/api/posts/${id}`); // ทำการลบโพสต์โดยใช้ id
      alert("Post deleted successfully!"); // แสดงข้อความเมื่อโพสต์ถูกลบสำเร็จ
      fetchPosts(); // เรียกใช้ฟังก์ชัน fetchPosts เพื่ออัปเดตข้อมูลโพสต์หลังจากลบ
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleFilterChange = () => {
    fetchPosts()} // เรียกใช้ฟังก์ชัน fetchPosts เมื่อมีการเปลี่ยนแปลงการกรอง

  useEffect(() => {
    fetchPosts(); // เรียกใช้ฟังก์ชัน fetchPosts เมื่อ component ถูก mount
    fetchCategories(); // เรียกใช้ฟังก์ชัน fetchCategories เมื่อ component ถูก mount
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Blog Posts</h1>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search by title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat: any) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="desc">Latest</option>
            <option value="asc">Oldest</option>
          </select>
          <button
            onClick={handleFilterChange}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
      <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Category
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post: any) => (
              <tr key={post.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {post.category.name || "Uncategorized"}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                    href={`/edit/${post.id}`}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link
        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        href="/create"
      >
        Create a New Post
      </Link>
    </div>
  );
}
