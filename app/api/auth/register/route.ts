import { NextRequest,NextResponse } from "next/server";
import {dbConnect} from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {
  try {
    const {email, password } = await request.json();
    
    if(!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    // Connect to the database
    await dbConnect();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }
    
    // Create a new user
    await User.create({
      email,
      password, // In a real application, make sure to hash the password before saving
    });
    
    return NextResponse.json({ message: "User registered successfully" }, { status: 201 });


  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}