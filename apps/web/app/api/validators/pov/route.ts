import { NextResponse } from "next/server";

import { scorePOV } from "@/lib/validators/pov";

export async function POST(request: Request) {
  const payload = await request.json();
  const result = await scorePOV(payload.text ?? "", payload.pov ?? {});
  return NextResponse.json(result);
}
