"use client";

import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Image from "next/image";

const Header = () => {
  const [userIcon, setUserIcon] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserIcon = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          // Redirect to login if token is not found
          window.location.href = "/login";
          return;
        }

        const response = await fetch("/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUserIcon(data.user.icone || ""); // Default empty string if no icon
        } else {
          setError(data.error || "Erro ao buscar ícone do usuário");
        }
      } catch (err) {
        setError("Erro na conexão com o servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUserIcon();
  }, []);

  if (loading) return <p>Carregando...</p>; // Optionally display a loader or spinner

  return (
    <header>
      <div className="header">
        <div className="logo-header">
          <Image src="/img/logo.png" alt="comentario" width={50} height={37} />
        </div>
        <div className="user-icon-container">
          {userIcon && (
            <Image
              src={userIcon}
              alt="Ícone do Usuário"
              width={40}
              height={40}
              className="user-icon"
            />
          )}
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </div>
      <Navbar className="navbar" />
    </header>
  );
};

export default Header;
