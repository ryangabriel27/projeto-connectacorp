import { useState } from "react";
import axios from "axios";

const AddPost = () => {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // Função para lidar com o envio do formulário
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
      // Envia os dados para a API de criação de post
      const response = await axios.post("/api/posts", { titulo, conteudo });

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
    <div>
      {error && <p>{error}</p>}
      {success && <p>Post criado com sucesso!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input
            placeholder="escreva seu titulo..."
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
          />
        </div>
        <div>
          <input
            placeholder="escreva seu conteúdo..."
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
          />
        </div>
        <button type="submit">Criar Post</button>
      </form>
    </div>
  );
};

export default AddPost;
