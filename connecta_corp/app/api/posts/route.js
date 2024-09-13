import { NextResponse } from "next/server";
import { createPost, getPosts, deletePost, updatePost } from "@/controllers/PostController"

// Criar um novo post
export async function POST(request) {
  const result = await createPost(request);
  return NextResponse.json(result, { status: result.status });
}

// Buscar todos os posts
export async function GET(request) {
  const result = await getPosts(request);
  return NextResponse.json(result, { status: result.status });
}



// Deletar um post
export async function DELETE(request) {
  const result = await deletePost(request);
  return NextResponse.json(result, { status: result.status });
}


