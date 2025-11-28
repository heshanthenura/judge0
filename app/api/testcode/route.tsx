import { NextResponse } from "next/server";

export async function GET() {
  console.log("API Route accessed");
  return NextResponse.json({ message: "Hello from TS API!" });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code } = body;
    console.log("Code received in API:", code);

    const payload = {
      source_code: code,
      language_id: 71,
      stdin: "MiAz",
      expected_output: "NQo=",
    };

    const response = await fetch(
      "https://heshanthenura.myaddr.io/api/submissions/?base64_encoded=true&wait=true",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    console.log("Judge0 Response:", result);

    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
