import "dotenv/config";
import { prisma } from "../lib/prisma";
import { createOrderAtomic } from "../src/lib/services/orderService";
import { assertSafeDestructiveTestEnvironment } from "./test-safety";

async function runConcurrencyTest() {
  assertSafeDestructiveTestEnvironment();
  console.log("🚀 Starting guarded real DB concurrency test...\n");

  const createdOrderIds = new Set<string>();
  const createdOrderNumbers = new Set<string>();
  let targetProductId: string | null = null;
  let targetVariantId: string | null = null;
  let initialProductStock: number | null = null;
  let initialVariantStock: number | null = null;

  try {
    const productWithoutVariant = await prisma.product.findFirst({
      where: { variants: { none: {} }, isActive: true },
    });

    if (productWithoutVariant) {
      targetProductId = productWithoutVariant.id;
      initialProductStock = productWithoutVariant.stockQuantity;
    } else {
      const productWithVariant = await prisma.product.findFirst({
        where: { variants: { some: {} }, isActive: true },
        include: { variants: { where: { isActive: true }, take: 1 } },
      });

      const variant = productWithVariant?.variants[0];
      if (!productWithVariant || !variant) {
        throw new Error("No active product is available for the concurrency test.");
      }

      targetProductId = productWithVariant.id;
      targetVariantId = variant.id;
      initialProductStock = productWithVariant.stockQuantity;
      initialVariantStock = variant.stockQuantity;
    }

    await prisma.product.update({
      where: { id: targetProductId },
      data: { stockQuantity: 2 },
    });

    if (targetVariantId) {
      await prisma.productVariant.update({
        where: { id: targetVariantId },
        data: { stockQuantity: 2 },
      });
    }

    console.log("⚡ Firing 5 concurrent purchase requests for 1 item each...");

    const results = await Promise.all(
      Array.from({ length: 5 }).map(async (_, i) => {
        try {
          const order = await createOrderAtomic({
            customerName: `Concurrent User ${i + 1}`,
            customerPhone: "03000000000",
            shippingAddress: "Race Condition Street",
            city: "Karachi",
            paymentMethod: "cod",
            items: [{ productId: targetProductId!, quantity: 1, variantId: targetVariantId }],
            idempotencyKey: `concurrency-test-${Date.now()}-${i}`,
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

    const successes = results.filter((result) => result === "SUCCESS").length;
    const failures = results.filter((result) => result.startsWith("FAILED")).length;

    const finalProduct = await prisma.product.findUnique({ where: { id: targetProductId } });
    let finalVariantStock: number | null = null;

    if (targetVariantId) {
      const finalVariant = await prisma.productVariant.findUnique({ where: { id: targetVariantId } });
      finalVariantStock = finalVariant?.stockQuantity ?? null;
    }

    console.log(results.join("\n"));
    console.log(`\n✅ Total Successes: ${successes} (Expected: 2)`);
    console.log(`❌ Total Failures: ${failures} (Expected: 3)`);
    console.log(`📦 Final Product Stock: ${finalProduct?.stockQuantity} (Expected: 0)`);
    if (targetVariantId) {
      console.log(`📦 Final Variant Stock: ${finalVariantStock} (Expected: 0)`);
    }

    const stockIsSafe =
      finalProduct?.stockQuantity === 0 &&
      (!targetVariantId || finalVariantStock === 0);

    if (successes !== 2 || failures !== 3 || !stockIsSafe) {
      throw new Error("Race-condition test failed: stock or success counts were unexpected.");
    }

    console.log("\n🛡️ CONCURRENCY SAFE: overselling was blocked.");
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

      if (targetVariantId && initialVariantStock !== null) {
        await prisma.productVariant.update({
          where: { id: targetVariantId },
          data: { stockQuantity: initialVariantStock },
        });
      }

      if (targetProductId && initialProductStock !== null) {
        await prisma.product.update({
          where: { id: targetProductId },
          data: { stockQuantity: initialProductStock },
        });
      }

      console.log("🧹 Concurrency test data and stock were restored.");
    } finally {
      await prisma.$disconnect();
    }
  }
}

runConcurrencyTest().catch((error) => {
  console.error("❌ Concurrency test failed:", error);
  process.exitCode = 1;
});
