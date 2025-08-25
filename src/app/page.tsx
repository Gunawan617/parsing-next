import PostList from './PostList';
import HomeClient from './HomeClient';

async function getPosts() {
  const res = await fetch('http://localhost:8000/api/public/posts', {
    cache: 'no-store',
    headers: { 'Accept': 'application/json' }
  });
  if (!res.ok) throw new Error('Failed to fetch posts');
  const data = await res.json();
  // Laravel: { success: true, data: { current_page, data: [...] } }
  if (data && data.success && data.data && Array.isArray(data.data.data)) {
    return data.data.data;
  }
  return [];
}

export default async function HomePage() {
  const posts = await getPosts();
  return <HomeClient posts={posts} />;
}
