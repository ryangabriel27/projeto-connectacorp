import Post from "@/models/Post"; // Assumindo que você tem o modelo Post
import connectMongo from "@/utils/dbConnect"; // Função para conectar ao MongoDB
import { NextResponse } from "next/server";
import User from "@/models/User";

export async function GET(request, { params }) {
  const { id } = params; // Obtém o ID dos parâmetros da URL
  await connectMongo();

  try {
    const post = await Post.findById(id).populate("userId"); // Busca o post pelo ID e popula o usuário

    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, post });
  } catch (error) {
    console.error("Erro ao buscar post:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar post" },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = params; // Obtém o ID do post dos parâmetros da URL
  const { titulo, conteudo } = await request.json();
  await connectMongo();

  try {
    // Verifica se o post existe
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json(
        { success: false, error: "Post não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os campos do post
    post.titulo = titulo || post.titulo;
    post.conteudo = conteudo || post.conteudo;
    const updatedPost = await post.save();

    return NextResponse.json({ success: true, data: updatedPost });
  } catch (error) {
    console.error("Erro ao editar post:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao editar post" },
      { status: 400 }
    );
  }
}
