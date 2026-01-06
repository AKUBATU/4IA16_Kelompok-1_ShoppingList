import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.item.count();
  if (count > 0) {
    console.log("Seed skipped: database already has data.");
    return;
  }

  await prisma.item.createMany({
    data: [
      { name: "Beras", quantity: 5, unit: "kg", category: "Sembako", priority: 1, note: "Cari yang pulen" },
      { name: "Telur", quantity: 1, unit: "kg", category: "Sembako", priority: 2 },
      { name: "Susu UHT", quantity: 2, unit: "pcs", category: "Minuman", priority: 2 },
      { name: "Sabun", quantity: 1, unit: "pcs", category: "Kebersihan", priority: 3 }
    ]
  });

  console.log("Seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
