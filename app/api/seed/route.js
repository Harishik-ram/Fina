import { NextResponse } from "next/server";

export async function POST() {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Seed disabled in production" },
      { status: 403 }
    );
  }

  const { seedTransactions } = await import("@/actions/seed");
  const result = await seedTransactions();

  return NextResponse.json(result);
}
