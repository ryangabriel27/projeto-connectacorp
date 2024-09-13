"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import PostsList from "@/components/PostsList";
import "@/styles/Login.css";

export default function PostsPage() {
  return (
    <>
      <Header />
      <PostsList />
      <Footer />
    </>
  );
}
