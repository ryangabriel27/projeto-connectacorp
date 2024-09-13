import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Criar um novo post
export const createPost = async (req) => {
  const { titulo, conteudo } = await req.json();
  await connectMongo();

  // Pega o token do cabeçalho da requisição
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return { success: false, error: "Token não fornecido", status: 401 };
  }

  try {
    // Decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Cria o novo post
    const newPost = new Post({ titulo, conteudo, userId });
    const savedPost = await newPost.save();

    return { success: true, data: savedPost, status: 201 };
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return { success: false, error: "Erro ao criar post", status: 400 };
  }
};

// Buscar todos os posts
export const getPosts = async (req) => {
  await connectMongo();
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 4;

  try {
    const posts = await Post.find()
      .populate({ path: "userId", select: "name" })
      .sort([["dataCriacao", "desc"]])
      .skip((page - 1) * limit)
      .limit(limit);

    return { success: true, posts, status: 200 };
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return { success: false, error: "Erro ao buscar posts", status: 500 };
  }
};

// Atualizar um post existente
export const updatePost = async (req, params) => {
  const { id } = params; // Obtém o ID do post dos parâmetros
  const { titulo, conteudo } = await req.json();
  await connectMongo();

  try {
    // Verifica se o post existe
    const post = await Post.findById(id);
    if (!post) {
      return { success: false, error: "Post não encontrado", status: 404 };
    }

    // Atualiza os campos do post
    post.titulo = titulo || post.titulo;
    post.conteudo = conteudo || post.conteudo;
    const updatedPost = await post.save();

    return { success: true, data: updatedPost, status: 200 };
  } catch (error) {
    console.error("Erro ao editar post:", error);
    return { success: false, error: "Erro ao editar post", status: 400 };
  }
};

// Deletar um post
export const deletePost = async (req) => {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  await connectMongo();

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return { success: false, error: "Post não encontrado", status: 404 };
    }
    return { success: true, data: deletedPost, status: 200 };
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return { success: false, error: "Erro ao deletar post", status: 400 };
  }
};

export const getById = async (req, params) => {
  const { id } = params; // Obtém o ID dos parâmetros da URL
  await connectMongo();

  try {
    const post = await Post.findById(id).populate("userId"); // Busca o post pelo ID e popula o usuário

    if (!post) {
      return { success: false, error: "Post não encontrado", status: 404 };
    }

    return { success: true, post, status: 200 };
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return { success: false, error: "Erro ao buscar posts", status: 500 };
  }
};
