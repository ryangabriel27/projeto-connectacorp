import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();
    await connectMongo();
    try {
        const user = await User.create(data);
        return NextResponse.json({ success: true }, { data: user });
    } catch (error) {
        return NextResponse.json({ success: false }, { error: 400 });
    }
}

export async function GET(request) { return NextResponse.json({ message: "Olá do Next.js" }, { status: 200 }); };