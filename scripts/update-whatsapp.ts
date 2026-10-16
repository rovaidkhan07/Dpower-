import "dotenv/config";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.storeSetting.upsert({
    where: { key: "store_whatsapp" },
    update: { value: "923065292187" },
    create: { key: "store_whatsapp", value: "923065292187" },
  });

  await prisma.storeSetting.upsert({
    where: { key: "store_phone" },
    update: { value: "+92 306 5292187" },
    create: { key: "store_phone", value: "+92 306 5292187" },
  });

  const updated = await prisma.storeSetting.findMany({
    where: { key: { in: ["store_whatsapp", "store_phone"] } },
  });

  console.log("✅ Updated settings:", updated);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
