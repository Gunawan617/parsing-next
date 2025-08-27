
import Image from 'next/image';
import { Metadata } from 'next';
import PostAnalytics from './PostAnalytics';


// Fungsi ambil post dari API Laravel
async function getPost(id: string) {
  const res = await fetch(`http://localhost:8000/api/public/posts/${id}`, {
    cache: 'no-store',
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error('Failed to fetch post');
  const data = await res.json();
  return data && data.success && data.data ? data.data : {};
}

// Format tanggal Indonesia
function formatDate(dateStr?: string) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// ✅ Metadata dinamis untuk SEO
export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const post = await getPost(params.id);

  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.summary,
    keywords: post.meta_keywords
      ? post.meta_keywords.split(',').map((t: string) => t.trim())
      : ['blog', 'artikel'],
    alternates: {
      canonical:
        post.canonical_url || `http://localhost:3000/posts/${params.id}`,
    },
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.summary,
      url: post.canonical_url || `http://localhost:3000/posts/${params.id}`,
      images: post.image
        ? [`http://localhost:8000/storage/${post.image}`]
        : [],
      type: 'article',
      publishedTime: post.published_at || post.created_at,
      authors: post.author ? [post.author] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.summary,
      images: post.image
        ? [`http://localhost:8000/storage/${post.image}`]
        : [],
    },
  };
}

// ✅ Komponen halaman detail post
export default async function PostDetail({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);

  // Ambil author & category dari DB
  const author = post.author || 'Admin';
  const category = post.category || null;

  // Tags dari meta_keywords
  const tags =
    post.meta_keywords && typeof post.meta_keywords === 'string'
      ? post.meta_keywords.split(',').map((t: string) => t.trim())
      : [];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4 sm:px-0">
      <PostAnalytics postId={params.id} />
      <h1 className="text-4xl font-bold mb-2 text-gray-900 leading-tight">
        {post.title}
      </h1>

      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-2">
        <span>{formatDate(post.published_at || post.created_at)}</span>
        <span>•</span>
        <span>By {author}</span>
        {category && (
          <>
            <span>•</span>
            <span>{category}</span>
          </>
        )}
      </div>

      {post.image && (
        <div className="mb-8 rounded-lg overflow-hidden shadow">
          <Image
            src={`http://localhost:8000/storage/${post.image}`}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-72 object-cover"
            priority
          />
        </div>
      )}

      <p className="text-lg text-gray-700 mb-6 italic">{post.summary}</p>

      <article
        className="prose prose-lg max-w-none text-gray-900 mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-6">
          {tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
