import Link from "next/link";
import react from "react";

const Navbar = () => {
  return (
    <nav>
      <div className="links">
        <Link className="poppins-bold" href="">meu perfil</Link>
        <Link className="poppins-bold" href="">logout.</Link>
      </div>
    </nav>
  );
};

export default Navbar;
