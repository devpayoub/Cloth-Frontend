import { NextResponse } from "next/server";
import { getProduct } from "@/api";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/products/[slug]">
) {
  const { slug } = await ctx.params;
  const product = await getProduct(slug);
  if (!product) {
    return NextResponse.json({ message: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}
