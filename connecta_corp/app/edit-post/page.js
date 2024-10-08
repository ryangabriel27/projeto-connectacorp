"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import Footer from "@/components/Footer";
import HeaderEdit from "@/components/HeaderEdit";
import '@/styles/Fonts.css';
import '@/styles/PostCard.css';
import '@/styles/EditPost.css';


const EditPost = () => {
  const router = useRouter();
  const searchParams = useSearchParams(); // Use a API de navegação corretamente
  const postId = searchParams.get("id"); // Obtém o ID do post a partir dos parâmetros da URL
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Adicionado para verificar autenticação

  useEffect(() => {
    // Verifica se o usuário está autenticado
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      router.push("/"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  // Função para buscar os dados do post a ser editado
  useEffect(() => {
    if (postId) {
      const fetchPostData = async () => {
        try {
          const response = await fetch(`/api/posts/${postId}`);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          const { titulo, conteudo } = data.post;
          setTitulo(titulo);
          setConteudo(conteudo);
        } catch (err) {
          console.error("Erro ao buscar o post:", err);
          setError("Erro ao carregar o post.");
        }
      };
      fetchPostData();
    }
  }, [postId]);

  // Função para lidar com a submissão do formulário de edição
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`/api/posts/${postId}`, {
        titulo,
        conteudo,
      });
      if (response.data.success) {
        setSuccess(true);
        alert("Post editado com sucesso!");
        router.push("/user"); // Redireciona de volta para o perfil do usuário após a edição
      } else {
        setError("Erro ao editar o post.");
      }
    } catch (err) {
      setError("Erro ao editar o post. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <>
      <HeaderEdit />
      <div className="edit-container">
        <h1 className="edit-post-title poppins-bold">Editar Post</h1>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>Post editado com sucesso!</p>}
        <div className="edit-form-container">
          <form onSubmit={handleSubmit} className="edit-form">
            <div className="edit-form-group">
              <label className="poppins-semibold">Título:</label>
              <input
                className="poppins-medium"
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)} />
            </div>
            <div className="edit-form-group">
              <label className="poppins-semibold">Conteúdo:</label>
              <input
                className="poppins-medium"
                type="text"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)} />
            </div>
            <button type="submit" className="edit-form-submit poppins-bold">Salvar alterações</button>
          </form>
        </div>
      </div><Footer/></>
  );
};

export default EditPost;
