import "dotenv/config";
import { prisma } from "../lib/prisma";
import { createOrderAtomic } from "../src/lib/services/orderService";
import { assertSafeDestructiveTestEnvironment } from "./test-safety";

async function runConcurrencyMultiProductTest() {
  assertSafeDestructiveTestEnvironment();
  console.log("🚀 Starting guarded multi-product concurrency test...\n");

  const createdOrderIds = new Set<string>();
  const createdOrderNumbers = new Set<string>();
  let p1Id: string | null = null;
  let p2Id: string | null = null;
  let p1InitialStock: number | null = null;
  let p2InitialStock: number | null = null;

  try {
    const products = await prisma.product.findMany({
      where: { isActive: true, variants: { none: {} } },
      take: 2,
    });

    if (products.length < 2) {
      throw new Error("Need at least 2 active products without variants for this test.");
    }

    const [p1, p2] = products;
    p1Id = p1.id;
    p2Id = p2.id;
    p1InitialStock = p1.stockQuantity;
    p2InitialStock = p2.stockQuantity;

    await prisma.$transaction([
      prisma.product.update({ where: { id: p1.id }, data: { stockQuantity: 2 } }),
      prisma.product.update({ where: { id: p2.id }, data: { stockQuantity: 2 } }),
    ]);

    console.log("⚡ Firing 5 overlapping multi-product purchases...");

    const overlapResults = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        try {
          const order = await createOrderAtomic({
            customerName: `Multi Concurrent User ${i + 1}`,
            customerPhone: "03000000000",
            shippingAddress: "Race Condition Street",
            city: "Karachi",
            paymentMethod: "cod",
            items: [
              { productId: p1.id, quantity: 1, variantId: null },
              { productId: p2.id, quantity: 1, variantId: null },
            ],
            idempotencyKey: `overlap-test-key-${Date.now()}-${i}`,
          });

          createdOrderIds.add(order.id);
          createdOrderNumbers.add(order.orderNumber);
          return "SUCCESS";
        } catch (error) {
          const message = error instanceof Error ? error.message : "unknown error";
          return `FAILED: ${message}`;
        }
      })
    );

    const successes = overlapResults.filter((result) => result === "SUCCESS").length;
    const failures = overlapResults.filter((result) => result.startsWith("FAILED")).length;

    const [final1, final2] = await Promise.all([
      prisma.product.findUnique({ where: { id: p1.id } }),
      prisma.product.findUnique({ where: { id: p2.id } }),
    ]);

    console.log(overlapResults.join("\n"));
    console.log(`\n✅ Total Successes: ${successes} (Expected: 2)`);
    console.log(`❌ Total Failures: ${failures} (Expected: 3)`);
    console.log(`📦 Final P1 Stock: ${final1?.stockQuantity} (Expected: 0)`);
    console.log(`📦 Final P2 Stock: ${final2?.stockQuantity} (Expected: 0)`);

    if (successes !== 2 || failures !== 3 || final1?.stockQuantity !== 0 || final2?.stockQuantity !== 0) {
      throw new Error("Multi-product race-condition test failed.");
    }

    console.log("\n🔄 Testing exact checkout idempotency...");
    await prisma.product.update({
      where: { id: p1.id },
      data: { stockQuantity: 5 },
    });

    const idempotencyKey = `idempotent-test-check-${Date.now()}`;
    const payload = {
      customerName: "Idempotent User",
      customerPhone: "03001112233",
      shippingAddress: "Double Click Street",
      city: "Lahore",
      paymentMethod: "cod" as const,
      items: [{ productId: p1.id, quantity: 1, variantId: null }],
      idempotencyKey,
    };

    const [orderA, orderB] = await Promise.all([
      createOrderAtomic(payload),
      createOrderAtomic(payload),
    ]);

    createdOrderIds.add(orderA.id);
    createdOrderIds.add(orderB.id);
    createdOrderNumbers.add(orderA.orderNumber);
    createdOrderNumbers.add(orderB.orderNumber);

    if (orderA.id !== orderB.id || orderA.orderNumber !== orderB.orderNumber) {
      throw new Error("Idempotency failed: duplicate requests created distinct orders.");
    }

    const idempotentStock = await prisma.product.findUnique({ where: { id: p1.id } });
    if (idempotentStock?.stockQuantity !== 4) {
      throw new Error(`Idempotency stock check failed: got ${idempotentStock?.stockQuantity}, expected 4.`);
    }

    console.log(`✅ IDEMPOTENCY PASS: duplicate requests resolved to ${orderA.orderNumber}`);
    console.log("🛡️ ALL CONCURRENCY AND IDEMPOTENCY CHECKS PASSED.");
  } finally {
    try {
      if (createdOrderNumbers.size > 0) {
        await prisma.inventoryTransaction.deleteMany({
          where: { referenceId: { in: [...createdOrderNumbers] } },
        });
      }

      if (createdOrderIds.size > 0) {
        await prisma.order.deleteMany({
          where: { id: { in: [...createdOrderIds] } },
        });
      }

      const stockRestores = [];
      if (p1Id && p1InitialStock !== null) {
        stockRestores.push(prisma.product.update({ where: { id: p1Id }, data: { stockQuantity: p1InitialStock } }));
      }
      if (p2Id && p2InitialStock !== null) {
        stockRestores.push(prisma.product.update({ where: { id: p2Id }, data: { stockQuantity: p2InitialStock } }));
      }
      if (stockRestores.length > 0) {
        await prisma.$transaction(stockRestores);
      }

      console.log("🧹 Multi-product test data and stock were restored.");
    } finally {
      await prisma.$disconnect();
    }
  }
}

runConcurrencyMultiProductTest().catch((error) => {
  console.error("❌ Multi-product concurrency test failed:", error);
  process.exitCode = 1;
});
