// components/Posts.js
import { useState, useEffect } from 'react';
import axios from 'axios';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`/api/posts?page=${page}`);
                setPosts(prevPosts => [...prevPosts, ...res.data.posts]);
                if (res.data.posts.length === 0) {
                    setHasMore(false);
                }
            } catch (err) {
                console.error(err);
            }
        };

        fetchPosts();
    }, [page]);

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || !hasMore) {
                return;
            }
            loadMore();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore]);

    return (
        <div>
            {posts.map(post => (
                <div key={post._id}>
                    <h2>{post.titulo}</h2>
                    <p>{post.conteudo}</p>
                    <p>Criado por: {post.userId.nome}</p> {/* Exibe o nome do criador */}
                </div>
            ))}
            {!hasMore && <p>Não há mais posts!</p>}
        </div>
    );
};

export default Posts;
