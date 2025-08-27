"use client";
import { useAnalytics } from "@/hooks/useAnalytics";

export default function HomeAnalytics() {
  useAnalytics("/homepage");
  return null;
}
