import { useState, useEffect } from "react";
import axios from "axios";
import PostCard from "./PostCard";

const PerfilUsuario = () => {
  const [userData, setUserData] = useState({
    nome: "",
    email: "",
    icone: "",
    cargo: "",
    setor: "",
  });
  const [userPosts, setUserPosts] = useState([]);
  const [editing, setEditing] = useState(false);

  // Função para buscar dados do usuário
  const fetchUserData = async () => {
    try {
      const response = await axios.get("/api/user");
      setUserData(response.data.user);
    } catch (error) {
      console.error("Erro ao buscar dados do usuário:", error);
    }
  };

  // Função para buscar posts do usuário
  const fetchUserPosts = async () => {
    try {
      const response = await axios.get("/api/user/posts");
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
    e.preventDefault();
    try {
      await axios.put("/api/user", userData);
      setEditing(false);
      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error);
      alert("Erro ao atualizar perfil.");
    }
  };

  // Função para excluir post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`/api/posts/${postId}`);
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Erro ao excluir post:", error);
      alert("Erro ao excluir post.");
    }
  };

  return (
    <div>
      <h1>Meu Perfil</h1>

      {editing ? (
        <form onSubmit={handleEditProfile}>
          <input
            type="text"
            placeholder="Nome"
            value={userData.nome}
            onChange={(e) => setUserData({ ...userData, nome: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Cargo"
            value={userData.cargo}
            onChange={(e) =>
              setUserData({ ...userData, cargo: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Setor"
            value={userData.setor}
            onChange={(e) =>
              setUserData({ ...userData, setor: e.target.value })
            }
          />
          <button type="submit">Salvar</button>
          <button onClick={() => setEditing(false)}>Cancelar</button>
        </form>
      ) : (
        <div>
          <p>
            <strong>Nome:</strong> {userData.nome}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Cargo:</strong> {userData.cargo}
          </p>
          <p>
            <strong>Setor:</strong> {userData.setor}
          </p>
          <button onClick={() => setEditing(true)}>Editar Perfil</button>
        </div>
      )}

      <h2>Meus Posts</h2>
      {userPosts.length > 0 ? (
        userPosts.map((post) => (
          <PostCard
            key={post._id}
            post={post}
            onDelete={() => handleDeletePost(post._id)}
          />
        ))
      ) : (
        <p>Você não tem nenhum post ainda.</p>
      )}
    </div>
  );
};

export default PerfilUsuario;
