import React from 'react';
import '@/styles/Fonts.css';
import '@/styles/PostCard.css';


const PostCard = ({ post }) => {
    return (
        <div className='post-card'>
            <div className='post-header'>
                <div className='post-username poppins-bold'>
                    <h4>{post.userId?.name || 'Desconhecido'}</h4>
                </div>
                <div className='post-date poppins-light'>
                    <h4>Publicado em: {new Date(post.dataCriacao).toLocaleDateString()}</h4>
                </div>
            </div>
            <div className='post-content'>
                <div className='post-title poppins-bold'>
                    <h2>{post.titulo}</h2>
                </div>
                <div className='post-text poppins-light'>
                    <p>{post.conteudo}</p>
                </div>
                <div className='post-button'>
                    <a href='' className='post-comment'>Comentar</a>
                </div>
            </div>

        </div>
    );
};

export default PostCard;