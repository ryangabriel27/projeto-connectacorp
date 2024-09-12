// app/posts/page.js

"use client";


import PostsList from "@/components/PostsList";
import { useRouter } from "next/navigation";

export default function PostsPage() {
    const router = useRouter();

    const handleLogout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
        localStorage.removeItem("token");
        router.push("/login");
      } catch (error) {
        console.error("Erro ao fazer logout:", error);
      }
    };

    return (
      <div>
        <h1>Todos os Posts</h1>
        <PostsList />
        <button onClick={handleLogout}>Logout</button>
      </div>
    );
}
