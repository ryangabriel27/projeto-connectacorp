import React from "react";
import Image from "next/image";
import "@/styles/Fonts.css";
import "@/styles/PostCard.css";
import { useRouter } from "next/navigation";

const PostUserCard = ({ post, onDelete }) => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push(`/edit-post?id=${post._id}`);
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="post-date poppins-light">
          <h4>
            Publicado em: {new Date(post.dataCriacao).toLocaleDateString()}
          </h4>
        </div>
      </div>
      <div className="post-content">
        <div className="post-text-content">
          <div className="post-title poppins-bold">
            <h2>{post.titulo}</h2>
          </div>
          <div className="post-text poppins-light">
            <p>{post.conteudo}</p>
          </div>
        </div>
        <div className="post-button-container">
          <div className="post-delete-button">
            <button
              onClick={() => onDelete(post._id)}
              className="poppins-regular"
            >
              Excluir Post
            </button>
          </div>
          <div className="post-button ">
            <button onClick={handleEditClick} className="poppins-regular">
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostUserCard;
