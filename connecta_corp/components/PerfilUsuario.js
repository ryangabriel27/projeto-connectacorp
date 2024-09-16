import { useState, useEffect } from "react";
import axios from "axios";
import PostUserCard from "./PostCardUser";
import Image from "next/image";
import "@/styles/Fonts.css";
import "@/styles/PerfilUsuario.css";
import Link from "next/link";

const PerfilUsuario = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    cargo: "",
    setor: "",
    icone: "",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [editing, setEditing] = useState(false);

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    // Obter o token do localStorage ou de onde está armazenado
    const token = localStorage.getItem("token"); // Certifique-se que o token foi salvo aqui após o login

    try {
      const response = await axios.get("/api/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
      });
      setUserData(response.data.user);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  // Função para buscar posts do usuário
  const fetchUserPosts = async () => {
    const token = localStorage.getItem("token"); // Certifique-se que o token foi salvo aqui após o login
    try {
      const response = await axios.get("/api/users/posts", {
        headers: {
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
      });
      setUserPosts(response.data.posts);
    } catch (error) {
      console.error("Erro ao buscar posts do usuário:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserPosts();
  }, []);

  // Função para editar informações do usuário
  const handleEditProfile = async (e) => {
    e.preventDefault(); // Previne o comportamento padrão do formulário

    // Obtém o token do localStorage
    const token = localStorage.getItem("token");

    // Verifica se o token existe
    if (!token) {
      alert("Token não encontrado. Faça login novamente.");
      return;
    }

    try {
      // Envia a requisição PUT para a API com os dados atualizados
      const response = await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
        body: JSON.stringify(userData), // Envia os dados do perfil no corpo da requisição
      });

      const result = await response.json(); // Obtém a resposta da API

      if (result.success) {
        setEditing(false); // Fecha o modo de edição
        alert("Perfil atualizado com sucesso!");
        // Opcional: Você pode recarregar os dados do usuário aqui se necessário
        // fetchUserData();
      } else {
        alert("Erro ao atualizar perfil. Tente novamente.");
      }
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil. Tente novamente.");
    }
  };

  // Função para excluir post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts?id=${postId}`);
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      alert("Erro ao excluir post.");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    window.location.reload();
  };

  return (
    <div>
      <div className="perfil-usuario">
        <div className="perfil-title poppins-bold">
          <h1>Meu perfil</h1>
        </div>
        <div className="main-usuario">
          <div className="icon-usuario">
            {userData.icone && (
              <Image
                src={userData.icone}
                alt="Ícone do Usuário"
                width={200}
                height={200}
                className="user-icon"
              />
            )}
          </div>
          {editing ? (
            <form onSubmit={handleEditProfile} className="form-edit-profile">
              <input
                type="text"
                placeholder="Nome"
                value={userData.name}
                className="poppins-semibold"
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                value={userData.email}
                className="poppins-semibold"
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Cargo"
                value={userData.cargo}
                className="poppins-semibold"
                onChange={(e) =>
                  setUserData({ ...userData, cargo: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Setor"
                value={userData.setor}
                className="poppins-semibold"
                onChange={(e) =>
                  setUserData({ ...userData, setor: e.target.value })
                }
              />
              <div className="button-group-user">
                <button type="submit" className="button-perfil-user poppins-semibold">
                  Salvar
                </button>
                <button onClick={handleCancel} className="button-perfil-user poppins-semibold">
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <div className="perfil-infos">
              <div className="info-group ">
                <p className="poppins-semibold">
                  <strong>Nome:</strong>
                </p>
                <p className="poppins-regular"> {userData.name}</p>
              </div>
              <div className="info-group">
                <p className="poppins-semibold">
                  <strong>Email:</strong>
                </p>{" "}
                <p className="poppins-regular">{userData.email}</p>
              </div>
              <div className="info-group">
                <p className="poppins-semibold">
                  <strong>Cargo:</strong>
                </p>{" "}
                <p className="poppins-regular">{userData.cargo}</p>
              </div>
              <div className="info-group">
                <p className="poppins-semibold">
                  <strong>Setor:</strong>
                </p>{" "}
                <p className="poppins-regular"> {userData.setor}</p>
              </div>
              <button
                onClick={() => setEditing(true)}
                className="edit-info poppins-bold"
              >
                Editar Perfil
              </button>
              <Link href="/icon" className="edit-info poppins-bold">
                Edite seu ícon
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="posts-usuario">
        <div className="post-title poppins-bold">
          <h2>Meus Posts</h2>
        </div>
        <div className="postUser-content">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <PostUserCard
                key={post._id}
                post={post}
                onDelete={() => handleDeletePost(post._id)}
              />
            ))
          ) : (
            <p>Você não tem nenhum post ainda.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PerfilUsuario;
