import { NextResponse } from "next/server";
import { parseComment } from "@/utils/parseComment";
import { prisma } from "@/libs/prisma";

export async function POST(req: Request) {
  // 1️⃣ รับ body
  const body = await req.json();
  const { liveId, customer, message } = body;

  // 2️⃣ validate
  if (!liveId || !customer || !message) {
    return NextResponse.json(
      { error: "liveId, customer, message are required" },
      { status: 400 }
    );
  }

  // 3️⃣ parse comment
  const parsed = parseComment(message);

  if (!parsed) {
    return NextResponse.json(
      { error: "invalid message format" },
      { status: 400 }
    );
  }

  // 4️⃣ หา product จาก DB
  const product = await prisma.product.findUnique({
    where: {
      code: parsed.productCode,
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "product not found" },
      { status: 404 }
    );
  }

  // 5️⃣ สร้าง Order + OrderItem
  const totalPrice = product.price * parsed.quantity;

  const order = await prisma.order.create({
    data: {
      liveId,
      customer,
      total: totalPrice,
      status: "PENDING",      // ✅ เพิ่ม (หรือ PAID / CONFIRMED ก็ได้)
      items: {
        create: {
          productId: product.id,
          quantity: parsed.quantity,
          price: product.price,
        },
      },
    },
    include: {
      items: true,
    },
  });



  // 6️⃣ ส่งผลลัพธ์กลับ
  return NextResponse.json({
    success: true,
    order,
  });
}

// ใช้เปิดใน browser
export async function GET() {
  return NextResponse.json({ message: "use POST method" });
}
