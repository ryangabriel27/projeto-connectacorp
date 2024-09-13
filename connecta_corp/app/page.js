"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Adicionado para feedback de carregamento
  const [error, setError] = useState(""); // Adicionado para exibir erros
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Inicia o estado de carregamento
    setError(""); // Limpa erros anteriores

    try {
      // Realiza o login
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        // Verifica o ícone do usuário
        const userResponse = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        const userData = await userResponse.json();

        if (userResponse.ok && userData.success) {
          if (!userData.user.icone) {
            router.push("/icon"); // Redireciona o de ícone
          } else {
            router.push("/posts"); // Redireciona para posts
          }
        } else {
          setError(userData.error || "Erro ao buscar dados do usuário");
        }
      } else {
        setError(data.message || "Credenciais inválidas");
      }
    } catch (err) {
      setError("Erro na conexão com o servidor");
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* Exibe mensagem de erro */}
      <input
        type="text"
        placeholder="Email do Usuário"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? "Entrando..." : "Login"}
      </button>
    </form>
  );
}
