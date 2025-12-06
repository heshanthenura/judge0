import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabase } from "@/app/utils/supabase";

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get("access_token")?.value;

  if (!accessToken) {
    return NextResponse.json({ loggedIn: false, user: null });
  }

  const { data, error: authError } = await supabase.auth.getUser(accessToken);
  const user = data?.user;

  if (authError || !user) {
    return NextResponse.json({ loggedIn: false, user: null });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("fName, lName, email")
    .eq("uuid", user.id)
    .single();

  if (profileError) {
    console.error("Profile fetch error:", profileError);
  }

  return NextResponse.json({
    loggedIn: true,
    user: {
      id: user.id,
      email: profile?.email || user.email || "",
      fName: profile?.fName || null,
      lName: profile?.lName || null,
    },
  });
}
