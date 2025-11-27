import { NextResponse } from "next/server";
import { fetchBuffItem } from "@/lib/buffClient";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");

  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  const data = await fetchBuffItem(itemId);
  return NextResponse.json(data);
}
