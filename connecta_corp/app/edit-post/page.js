"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";

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
      router.push("/login"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  // Função para buscar os dados do post a ser editado
  useEffect(() => {
    if (postId) {
      console.log(postId);
      const fetchPostData = async () => {
        try {
          const response = await axios.get(`/api/posts/${postId}`);
          const { titulo, conteudo } = response.data.post;
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
    <div>
      <h1>Editar Post</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Post editado com sucesso!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div>
          <label>Conteúdo:</label>
          <textarea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
        </div>
        <button type="submit">Salvar alterações</button>
      </form>
    </div>
  );
};

export default EditPost;
