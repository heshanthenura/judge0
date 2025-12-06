import { QuestionTest } from "@/app/types/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body: QuestionTest = await req.json();

  if (!body.code || !body.sample_input || !body.sample_output) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }
  console.log(body);
  console.log(btoa(body.code));
  console.log(btoa(body.sample_input));
  console.log(btoa(body.sample_output));

  const payload = {
    source_code: btoa(body.code),
    stdin: btoa(body.sample_input),
    expected_output: btoa(body.sample_output),
    language_id: 71,
  };

  const response = await fetch(
    "https://heshanthenura.myaddr.io/api/submissions/?base64_encoded=true&wait=true",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok) {
    return NextResponse.json({ error: true }, { status: 400 });
  }

  const result = await response.json();
  console.log(result);
  if (result.status.id === 3) {
    return NextResponse.json({ done: "accepted" }, { status: 200 });
  } else if (result.status.id === 11) {
    return NextResponse.json({ error: "Runtime Error" }, { status: 400 });
  } else {
    return NextResponse.json({ error: "Wrong Answer" }, { status: 400 });
  }
}
