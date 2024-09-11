// app/posts/page.js

"use client";

import Header from "@/components/Header";
import PostsList from "@/components/PostsList";

export default function PostsPage() {
  return (
    <>
      <Header />
        <PostsList/>
    </>
  );
}
