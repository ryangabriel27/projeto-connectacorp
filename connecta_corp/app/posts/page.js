// app/posts/page.js

"use client";


import PostsList from "@/components/PostsList";

export default function PostsPage() {
    return (
        <div>
            <h1>Todos os Posts</h1>
            <PostsList />
        </div>
    );
}
