import { NextResponse } from "next/server";
import { supabase } from "@/app/utils/supabase";

interface RegisterBody {
  fName: string;
  lName: string;
  regNumber: string;
  email: string;
  password: string;
  confPassword: string;
}

export async function POST(req: Request) {
  try {
    const body: RegisterBody = await req.json();
    const { fName, lName, regNumber, email, password, confPassword } = body;

    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .limit(1)
      .single();

    if (data) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 400 }
      );
    }

    if (
      !fName ||
      !lName ||
      !regNumber ||
      !email ||
      !password ||
      !confPassword
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const regPattern = /^[A-Z]{2}\d{8}$/;
    if (!regPattern.test(regNumber)) {
      return NextResponse.json(
        { error: "Invalid registration number format. Example: IT24100028" },
        { status: 400 }
      );
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password !== confPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    if (authError)
      return NextResponse.json({ error: authError.message }, { status: 400 });

    console.log(authData.user?.id);

    const { error: insertError } = await supabase.from("users").insert([
      {
        uuid: authData.user?.id,
        fName,
        lName,
        regNumber,
        email,
      },
    ]);

    if (insertError)
      return NextResponse.json({ error: insertError.message }, { status: 400 });

    console.log("Valid registration data:", body);
    return NextResponse.json(
      { message: "Confirm your email to activate account" },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
