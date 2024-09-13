"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import "@/styles/Login.css";
import "@/styles/Fonts.css";

export default function Login() {
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
    <>
      <div className="login-container">
        <div className="login-form">
          <h2 className="form-title poppins-medium">Login</h2>
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="input-group poppins-medium">
              <label htmlFor="email">Email</label>
              <input
                id="email "
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="seu@email.com"
              />
            </div>
            <div className="input-group poppins-medium">
              <label htmlFor="password">Senha</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Sua senha"
              />
            </div>
            <div className="button-group poppins-medium">
              <button className="login-button" type="submit" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </button>
              <a href="/register" className="forgot-password">
                Cadastre-se.
              </a>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
