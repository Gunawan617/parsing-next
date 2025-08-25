import Link from "next/link";
import Image from "next/image";

export default function PostList({ posts }: { posts: any[] }) {
  if (!posts.length) {
    return (
      <div className="text-gray-500 text-center py-12">
        Tidak ada postingan ditemukan.
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden flex flex-col"
        >
          {/* Thumbnail */}
          {post.image && (
            <Link href={`/posts/${post.id}`} className="block relative h-48">
              <Image
                src={`http://localhost:8000/storage/${post.image}`}
                alt={post.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </Link>
          )}

          {/* Content */}
          <div className="p-4 flex-1 flex flex-col">
            <Link
              href={`/posts/${post.id}`}
              className="text-lg font-semibold text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {post.title}
            </Link>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(post.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-gray-600 mt-2 line-clamp-3">{post.summary}</p>

            <div className="mt-auto pt-3">
              <Link
                href={`/posts/${post.id}`}
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                Baca Selengkapnya →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
