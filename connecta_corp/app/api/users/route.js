import jwt from "jsonwebtoken";
import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

// Pegar as informações do usuário
export async function GET(request) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  await connectMongo();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    return NextResponse.json({ success: true, user });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao buscar dados do usuário" },
      { status: 500 }
    );
  }
}

// Editar informações do usuário
export async function PUT(request) {
  const { nome, email, icone, cargo, setor } = await request.json();
  await connectMongo();

  // Extrai o token do cabeçalho
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Assume formato "Bearer <token>"

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  try {
    // Verifica o token e extrai o userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Encontra o usuário pelo ID e atualiza as informações
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { nome, email, icone, cargo, setor },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar usuário" },
      { status: 500 }
    );
  }
}
