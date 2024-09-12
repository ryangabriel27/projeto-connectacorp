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

export async function PUT(request) {
  await connectMongo();

  // Obtém o token do cabeçalho da requisição
  const token = request.headers.get("Authorization")?.split(" ")[1]; // Assume formato "Bearer <token>"

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Token não fornecido" },
      { status: 401 }
    );
  }

  try {
    // Decodifica o token para obter o userId
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId; // Assumindo que o token contenha o campo userId

    const { name, email, cargo, setor } = await request.json();

    // Verifica se o usuário existe
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    // Atualiza os campos do usuário
    user.name = name || user.name;
    user.email = email || user.email;
    user.cargo = cargo || user.cargo;
    user.setor = setor || user.setor;

    const updatedUser = await user.save();

    return NextResponse.json({ success: true, data: updatedUser });
  } catch (error) {
    console.error("Erro ao atualizar usuário:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar usuário" },
      { status: 400 }
    );
  }
}

