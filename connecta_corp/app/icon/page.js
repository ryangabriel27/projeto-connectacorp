"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const icons = [
  "https://pbs.twimg.com/profile_images/1785962874206052352/1i32rec9_400x400.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBBOVh3eZ138r1BxT-pkmR24vlbT5ooZdo0w&s",
  "https://cdn.awsli.com.br/2616/2616886/produto/262077837/onca_sussuarana_p_bichos_de_pano-to1h67n8z0.jpg",
];

export default function SelectIconPage() {
  const [selectedIcon, setSelectedIcon] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsAuthenticated(false);
      router.push("/login"); // Redireciona para a página de login se não estiver autenticado
    }
  }, [router]);

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!selectedIcon) {
        setError("Por favor, selecione um ícone.");
        setLoading(false);
        return;
      }

      const response = await fetch("/api/auth/update-icon", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Inclui o token no cabeçalho
        },
        body: JSON.stringify({ icon: selectedIcon }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/user");
      } else {
        setError(data.error || "Erro ao salvar ícone");
      }
    } catch (err) {
      setError("Erro na conexão com o servidor");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null; // Ou uma tela de carregamento enquanto redireciona
  }

  return (
    <div>
      <h1>Escolha um Ícone</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ display: "flex", gap: "10px" }}>
        {icons.map((icon, index) => (
          <img
            key={index}
            src={icon}
            alt={`Icon ${index + 1}`}
            style={{
              width: "50px",
              height: "50px",
              cursor: "pointer",
              border: selectedIcon === icon ? "2px solid blue" : "none",
            }}
            onClick={() => handleIconSelect(icon)}
          />
        ))}
      </div>
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </div>
  );
}
