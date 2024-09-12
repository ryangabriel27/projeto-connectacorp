// app/api/auth/update-icon/route.js

import connectMongo from "@/utils/dbConnect";
import User from "@/models/User";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  await connectMongo();

  // Obtém o token do cabeçalho da requisição
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Assume formato "Bearer <token>"

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  const { icon } = await request.json();

  try {
    // Verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;

    // Atualiza o ícone do usuário
    const user = await User.findByIdAndUpdate(
      userId,
      { icone: icon },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao atualizar ícone:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar ícone" },
      { status: 500 }
    );
  }
}
