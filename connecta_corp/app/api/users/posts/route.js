import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Post from "@/models/Post";
import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";

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
    const userId = decoded.userId; // Defina userId a partir do token decodificado

    const posts = await Post.find({ userId });

    const user = await User.findById(userId).select("icone");
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, posts, icon: user.icone });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Erro ao buscar posts do usuário" },
      { status: 500 }
    );
  }
}
