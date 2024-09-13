"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import '@/styles/Fonts.css';
import '@/styles/Footer.css';

const Footer = () => {
  return <div className="footer-container">
    <div className="footer-hr"></div>
    <footer>
        <div className="footer-img">

        </div>
        <div className="footer-text poppins-light">
            <p>Todos os direitos reservados - EstampCorp 2024</p>
        </div>
    </footer>
  </div>;
};

export default Footer;
