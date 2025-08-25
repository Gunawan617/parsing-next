"use client";
import { useState } from "react";
import PostList from "./PostList";
import Image from "next/image";

export default function HomeClient({ posts }: { posts: any[] }) {
  // Sort latest by created_at desc
  const latestPosts = [...posts]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 3);

  // Popular: contoh pakai slice (nanti bisa ganti pakai field views)
  const popularPosts = posts.slice(0, 3);

  const [search, setSearch] = useState("");
  const filteredPosts = search
    ? posts.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.summary.toLowerCase().includes(search.toLowerCase())
      )
    : posts;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4 lg:px-0">
      <div className="flex flex-col md:flex-row gap-10">
        {/* Left: Main Content */}
        <div className="flex-1">
          {/* Search Bar */}
          <div className="mb-8 relative">
            <input
              type="text"
              placeholder="🔍 Cari artikel..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
          </div>

          {/* Post List */}
          <PostList posts={filteredPosts} />
        </div>

        {/* Right: Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          {/* Latest Articles */}
          <div className="mb-10 bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              📌 Artikel Terbaru
            </h2>
            <ul className="space-y-4">
              {latestPosts.map((post) => (
                <li key={post.id}>
                  <a
                    href={`/posts/${post.id}`}
                    className="flex items-center gap-3 group"
                  >
                    {post.image && (
                      <div className="w-14 h-14 relative flex-shrink-0 rounded-lg overflow-hidden shadow">
                        <Image
                          src={`http://localhost:8000/storage/${post.image}`}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-gray-800 group-hover:text-blue-600 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Articles */}
          <div className="bg-white rounded-xl shadow-md p-5">
            <h2 className="text-xl font-bold mb-4 border-b pb-2">
              ⭐ Artikel Populer
            </h2>
            <ul className="space-y-3">
              {popularPosts.map((post) => (
                <li key={post.id}>
                  <a
                    href={`/posts/${post.id}`}
                    className="text-gray-700 hover:text-blue-600 font-medium text-sm"
                  >
                    • {post.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
