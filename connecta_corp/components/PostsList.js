"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import "@/styles/Fonts.css";
import "@/styles/PostCard.css";
import AddPost from "./AddPost";
import { useRouter } from "next/navigation";

const POSTS_PER_PAGE = 4;

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0,
  });
  const router = useRouter();

    useEffect(() => {
      const fetchPosts = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login"); // Redireciona para login se o usuário não estiver autenticado
          return;
        }

        const response = await fetch("/api/posts", {
          headers: {
            Authorization: `Bearer ${token}`, // Envia o token no header da requisição
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPosts(data.posts);
        } else {
          router.push("/login"); // Redireciona para login se houver erro
        }
      };

      fetchPosts();
    }, [router]);

  const fetchPosts = useCallback(async () => {
    try {
      const response = await axios.get(
        `/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`
      );
      const newPosts = response.data.posts;
      // Update posts state with new posts, avoiding duplicates
      setPosts((prevPosts) => {
        const existingPostIds = new Set(prevPosts.map((post) => post._id));
        const uniquePosts = newPosts.filter(
          (post) => !existingPostIds.has(post._id)
        );
        return [...prevPosts, ...uniquePosts];
      });
      if (newPosts.length < POSTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  }, [page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [inView, hasMore]);

  return (
    <>
      <AddPost />
      <div className="posts-list">
        <div>
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
        {hasMore && (
          <div ref={ref} style={{ height: "20px", background: "#f0f0f0" }}>
            Carregando mais posts...
          </div>
        )}
      </div>
    </>
  );
};

export default PostsList;
