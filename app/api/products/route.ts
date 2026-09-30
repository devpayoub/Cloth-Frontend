import { NextResponse } from "next/server";
import { listProducts } from "@/api";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;
  const products = await listProducts(category ? { category } : {});
  return NextResponse.json({ count: products.length, products });
}
