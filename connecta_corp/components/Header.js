import react from "react";
import Navbar from "./Navbar";
import Image from "next/image";

const Header = () => {
  return (
    <header>
      <div className="header">
        <div className="logo-header">
          <Image
            src="/img/logo.png"
            alt="comentario"
            width={50}
            height={37}
          />
        </div>
      </div>
      <Navbar className="navbar" />
    </header>
  );
};

export default Header;
