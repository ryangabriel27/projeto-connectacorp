import { useState } from "react";
import axios from "axios";
import "@/styles/Fonts.css";
import "@/styles/PostCard.css";

const AddPost = () => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificação simples para garantir que os campos não estejam vazios
    if (!titulo || !conteudo) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Limpa mensagens de erro e sucesso
    setError("");
    setSuccess(false);

    try {
      // Obter o token do localStorage ou de onde está armazenado
      const token = localStorage.getItem("token"); // Certifique-se que o token foi salvo aqui após o login

      // Envia os dados para a API de criação de post com o token no cabeçalho Authorization
      const response = await axios.post(
        "/api/posts",
        { titulo, conteudo },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
          },
        }
      );

      if (response.data.success) {
        setSuccess(true);
        setTitulo(""); // Limpa o campo título
        setConteudo(""); // Limpa o campo conteúdo
      } else {
        setError("Erro ao criar o post.");
      }
    } catch (err) {
      setError("Erro ao criar o post. Tente novamente mais tarde.");
      console.error(err);
    }
  };

  return (
    <div className="posts-list">
      {error && <p className="poppins-light add-error">{error}</p>}
      {success && (
        <p className="poppins-light add-great">Post criado com sucesso!</p>
      )}
      <form onSubmit={handleSubmit} className="form-add-post">
        <div className="add-post-title">
          <input
            placeholder="escreva seu título..."
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="add-title kanit-bold"
          />
        </div>
        <div className="add-post-content">
          <textarea
            placeholder="escreva seu conteúdo..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            className="add-content kanit-bold"
          />
          <button type="submit" className="submit-post poppins-bold">
            adicionar post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
