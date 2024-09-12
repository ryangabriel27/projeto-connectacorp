"use client";

import Header from "@/components/Header";
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
      <>
      <Header />
        <PostsList />
        <button onClick={handleLogout}>Logout</button>
</>
    );
}
