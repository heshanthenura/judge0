import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/app/utils/supabase";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ loggedIn: false, user: null });
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(accessToken);

  if (authError || !user) {
    return NextResponse.json({ loggedIn: false, user: null });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("fName, lName, email")
    .eq("uuid", user.id)
    .single();

  console.log(profile);

  if (profileError) {
    console.error("Profile fetch error:", profileError);
  }

  return NextResponse.json({
    loggedIn: true,
    user: profile || { email: user.email, fName: null, lName: null },
  });
}
