// app/register/page.js

"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import "@/styles/Register.css";
import "@/styles/Fonts.css";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cargo, setCargo] = useState("");
  const [setor, setSetor] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !cargo || !setor) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError("");
    setSuccess(false);

    try {
      const response = await axios.post("/api/auth/register", {
        name,
        email,
        password,
        cargo,
        setor,
      });

      if (response.data.success) {
        setSuccess(true);
        setName("");
        setEmail("");
        setPassword("");
        setCargo("");
        setSetor("");
        setTimeout(() => router.push("/"), 2000);
      } else {
        setError("Erro ao registrar usuário.");
      }
    } catch (err) {
      setError("Erro ao registrar usuário. Tente novamente mais tarde.");
      console.error(err);
    }
  };

  return (
    <div className="body">
      <div className="register-container">
        <div className="register-form-container">
          <h1>Registro</h1>
          {error && <p className="error-message">{error}</p>}
          {success && (
            <p className="success-message">
              Registro realizado com sucesso! Redirecionando...
            </p>
          )}
          <form onSubmit={handleSubmit} className="register-form">
            <div className="form-group">
              <label htmlFor="name">Nome:</label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu email"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Senha:</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
              />
            </div>
            <div className="form-group">
              <label htmlFor="cargo">Cargo:</label>
              <input
                id="cargo"
                type="text"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
                placeholder="Seu cargo"
              />
            </div>
            <div className="form-group">
              <label htmlFor="setor">Setor:</label>
              <input
                id="setor"
                type="text"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                placeholder="Seu setor"
              />
            </div>
            <button type="submit">Registrar</button>
          </form>
          <a href="/" className="login">
            Fazer Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
