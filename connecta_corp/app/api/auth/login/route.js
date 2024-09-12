import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(request) {
  const { email, password } = await request.json();

  await connectMongo();
  try {
    const user = await User.findOne({ email });

    if (user) {
      // Aguarde a comparação da senha
      const isPasswordMatch = await user.comparePassword(password);
      console.log(`Password match successful: ${isPasswordMatch}`);

      if (isPasswordMatch) {
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return NextResponse.json({ token });
      }
    }

    console.log("Invalid email or password"); // Log para identificar falha na validação
    return NextResponse.json({ success: false }, { status: 400 });
  } catch (error) {
    console.error("Error during authentication:", error); // Log para capturar e exibir qualquer erro
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
