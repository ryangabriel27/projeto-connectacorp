"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "@/styles/Fonts.css";
import "@/styles/Icon.css";

const icons = [
  "https://pbs.twimg.com/profile_images/1785962874206052352/1i32rec9_400x400.png",
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSBBOVh3eZ138r1BxT-pkmR24vlbT5ooZdo0w&s",
  "https://cdn.awsli.com.br/2616/2616886/produto/262077837/onca_sussuarana_p_bichos_de_pano-to1h67n8z0.jpg",
  "/img/person1.png",
  "/img/person2.png",
  "/img/person3.png",
  "/img/person4.png",
  "/img/person5.png",
  "/img/person6.png",
  "/img/person7.png",
  "/img/person8.png",
  "/img/person9.png",
  "/img/ben10.png",
  "/img/goku.png",
  "/img/net.png",
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
      router.push("/"); // Redireciona para a página de login se não estiver autenticado
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
    <div className="body ">
      <div className="icon-selection-container">
        <div className="icon-selection-form">
          <h1>Escolha um Ícone</h1>
          {error && <p className="error-message">{error}</p>}
          <div className="icons-grid">
            {icons.map((icon, index) => (
              <div
                key={index}
                className={`icon-option ${
                  selectedIcon === icon ? "selected" : ""
                }`}
                onClick={() => handleIconSelect(icon)}
              >
                <img src={icon} alt={`Icon ${index + 1}`} />
              </div>
            ))}
          </div>
          <button
            className="submit-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </div>
      </div>
    </div>
  );
}