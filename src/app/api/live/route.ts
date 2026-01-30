import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { userId } = body;

  if (!userId) {
    return NextResponse.json(
      { error: "userId is required" },
      { status: 400 }
    );
  }

  

  const live = await prisma.liveSession.create({
    data: {
      userId,
      status: "LIVE",
    },
  });

  return NextResponse.json(live);
}
export async function GET() {
  const live = await prisma.liveSession.findFirst({
    where: { status: "LIVE" },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(live);
}
