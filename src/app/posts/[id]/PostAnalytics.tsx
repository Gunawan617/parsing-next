"use client";
import { useAnalytics } from "@/hooks/useAnalytics";


export default function PostAnalytics({ postId }: { postId: string }) {
  useAnalytics(`/posts/${postId}`); // No change needed, keeping the original line
  return null;
}
