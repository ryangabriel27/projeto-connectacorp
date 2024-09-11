// app/api/posts/route.js
import Post from "@/models/Post";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// Criar um novo post
export async function POST(request) {
  const { titulo, conteudo } = await request.json();
  await connectMongo();
  // Pega o token do cabeçalho da requisição
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Assume formato "Bearer <token>"

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  try {
    // Decodifica o token para obter o userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifica o token usando a chave secreta
    const userId = decoded.userId; // Assumindo que o token contenha o campo userId

    // Cria o novo post com o userId do usuário logado
    const newPost = new Post({ titulo, conteudo, userId });
    const savedPost = await newPost.save();

    return NextResponse.json({ success: true, data: savedPost });
  } catch (error) {
    console.error("Erro ao criar post:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar post" },
      { status: 400 }
    );
  }
}

// Buscar todos os posts
export async function GET(request) {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page")) || 1;
  const limit = parseInt(searchParams.get("limit")) || 4;

  try {
    const posts = await Post.find()
      .populate({ path: "userId", select: "name" })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ success: true, posts });
  } catch (error) {
    console.error("Erro ao buscar posts:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar posts" },
      { status: 500 }
    );
  }
}

// Atualizar um post
export async function PUT(request) {
  const { id, titulo, conteudo } = await request.json();
  await connectMongo();

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { titulo, conteudo },
      { new: true }
    );
    if (!updatedPost) {
      return NextResponse.json(
        { success: false, error: "Post não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Erro ao atualizar post:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar post" },
      { status: 400 }
    );
  }
}

// Deletar um post
export async function DELETE(request) {
  const { id } = await request.json();
  await connectMongo();

  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      return NextResponse.json(
        { success: false, error: "Post não encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, data: deletedPost });
  } catch (error) {
    console.error("Erro ao deletar post:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao deletar post" },
      { status: 400 }
    );
  }
}
