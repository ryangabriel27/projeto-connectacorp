import User from "@/models/User";
import connectMongo from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
    try {
        const { email, password } = await req.json();

        await connectMongo();

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });
            return NextResponse.json({ token });
        } else {
            return NextResponse.json(
                { success: false },
                { status: 400 }
            );
        }
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "An error occurred", error: error.message },
            { status: 500 }
        );
    }
}