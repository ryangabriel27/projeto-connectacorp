"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useInView } from "react-intersection-observer";
import PostCard from "./PostCard";
import AddPost from "./AddPost";
import { useRouter } from "next/navigation";

const POSTS_PER_PAGE = 4;

const PostsList = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  // Hook `useInView` monitora quando um elemento entra em vista (quando o usuário faz scroll até o fim da página)
  const { ref } = useInView({
    triggerOnce: false, // Define para não limitar o trigger a apenas uma vez
    threshold: 0, // Define o quanto do elemento precisa estar visível para disparar o evento (0 significa qualquer parte visível)
    onChange: (inView) => {
      if (inView && hasMore) {
        // Quando o elemento estiver visível (inView é true) e houver mais posts (hasMore)
        setPage((prevPage) => prevPage + 1); // Incrementa a página para carregar mais posts
      }
    },
  });
  const router = useRouter();

  // Função para buscar posts
  const fetchPosts = useCallback(async () => {
    try {
      const token = localStorage.getItem("token"); // Verifica novamente se ele está logado
      if (!token) {
        router.push("/");
        return;
      }

      const response = await fetch(
        // Faz o GET de todos os posts respeitando o limite de posts por página
        `/api/posts?page=${page}&limit=${POSTS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const newPosts = data.posts;

        // Adiciona novos posts apenas se não existirem ainda
        setPosts((prevPosts) => {
          const postIds = new Set(prevPosts.map((post) => post._id));
          const filteredPosts = newPosts.filter(
            (post) => !postIds.has(post._id)
          );
          return [...prevPosts, ...filteredPosts];
        });

        if (newPosts.length < POSTS_PER_PAGE) setHasMore(false); // Se não houver mais posts
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("Erro ao buscar posts:", error);
    }
  }, [page, router]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Função para limpar e atualizar a lista de posts ao adicionar um novo post
  const handlePostAdded = async () => {
    setPage(1); // Reseta a página para garantir que posts antigos não sejam duplicados
    setHasMore(true);
    setPosts([]); // Limpa os posts para carregar a lista novamente
    await fetchPosts(); // Carrega os posts de novo
  };

  return (
    <>
      <AddPost onPostAdded={handlePostAdded} />
      <div className="posts-list">
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
        {hasMore && (
          <div ref={ref} style={{ height: "20px" }}>
            Carregando mais posts...
          </div>
        )}
      </div>
    </>
  );
};

export default PostsList;
