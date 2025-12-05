import { supabase } from "@/app/utils/supabase";
export async function GET() {
  const { data, error } = await supabase
    .from("challenges")
    .select("id, title, description");

  if (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }

  return Response.json({ success: true, data }, { status: 200 });
}
