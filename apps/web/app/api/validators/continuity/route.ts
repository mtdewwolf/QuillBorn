import { NextResponse } from "next/server";

import { scoreContinuity } from "@/lib/validators/continuity";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await scoreContinuity(payload.text ?? "", payload.context ?? {});
  return NextResponse.json(result);
}
