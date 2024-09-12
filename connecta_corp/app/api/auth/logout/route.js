// app/api/auth/logout/route.js

import { NextResponse } from "next/server";

export async function POST() {
  try {
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao processar o logout:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
