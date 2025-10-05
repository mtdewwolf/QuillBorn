import { NextResponse } from "next/server";

import { scorePace } from "@/lib/validators/pace";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await scorePace(payload.text ?? "");
  return NextResponse.json(result);
}
