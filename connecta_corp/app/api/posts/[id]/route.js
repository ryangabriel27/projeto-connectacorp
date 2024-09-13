import { NextResponse } from "next/server";
import { getById, updatePost } from "@/controllers/PostController";

export async function GET(request, { params }) {
  const result = await getById(request, params);
  return NextResponse.json(result, { status: result.status });
}

// Atualizar um post
export async function PUT(request, { params }) {
  const result = await updatePost(request, params);
  return NextResponse.json(result, { status: result.status });
}
