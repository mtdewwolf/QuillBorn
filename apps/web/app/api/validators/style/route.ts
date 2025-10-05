import { NextResponse } from "next/server";

import { scoreStyle } from "@/lib/validators/style";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await scoreStyle(payload.text ?? "");
  return NextResponse.json(result);
}
