import Link from "next/link";
import react from "react";
import { useRouter } from "next/navigation";

const Navbar = () => {

  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("token");
      router.push("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  return (
    <nav>
      <div className="links">
        <Link className="poppins-bold" href="/user">
          meu perfil
        </Link>
        <Link className="poppins-bold" href="/posts">
          home
        </Link>
        <Link className="poppins-bold" href="" onClick={handleLogout}>
          logout.
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
