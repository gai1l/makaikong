import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.create({
    data: {
      name: "Product A",
      description: "Test product",
      code: "A01",
      price: 100,
      stock: 10,
    },
  });

  console.log("✅ Seed product success");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
