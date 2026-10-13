import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { prisma } from "../lib/prisma";
import { createOrderAtomic, updateOrderAdmin } from "../src/lib/services/orderService";
import { assertSafeDestructiveTestEnvironment } from "./test-safety";

async function run() {
  assertSafeDestructiveTestEnvironment();
  const categoryId = randomUUID();
  const orderIds: string[] = [];
  const orderNumbers: string[] = [];
  try {
    await prisma.category.create({ data: { id: categoryId, name: "Status regression", slug: categoryId } });
    for (const scenario of ["cancel-first", "process-first", "duplicate-cancel", "invalid-payment"]) {
      const fixtureId = randomUUID();
      const product = await prisma.product.create({ data: {
        name: "Isolated status test", slug: fixtureId, sku: fixtureId,
        description: "Temporary regression fixture", brand: "Test", categoryId,
        price: 100, stockQuantity: 10,
        variants: { create: { name: "Test variant", sku: randomUUID(), stockQuantity: 10, attributes: "{}" } },
      }, include: { variants: true } });
      const variant = product.variants[0];
      const order = await createOrderAtomic({
        customerName: "Status Test", customerPhone: "03001234567",
        shippingAddress: "Temporary Test Street", city: "Karachi", paymentMethod: "cod",
        idempotencyKey: randomUUID(), items: [{ productId: product.id, variantId: variant.id, quantity: 2 }],
      });
      orderIds.push(order.id);
      orderNumbers.push(order.orderNumber);
      await updateOrderAdmin(order.id, { orderStatus: "confirmed" });
      const cancel = () => updateOrderAdmin(order.id, { orderStatus: "cancelled" });
      const process = () => updateOrderAdmin(order.id, { orderStatus: "processing" });
      if (scenario === "duplicate-cancel") {
        const results = await Promise.allSettled(Array.from({ length: 4 }, cancel));
        assert.ok(results.every(result => result.status === "fulfilled"));
      } else if (scenario === "invalid-payment") {
        await assert.rejects(updateOrderAdmin(order.id, { orderStatus: "cancelled", paymentStatus: "invalid" }));
      } else {
        const results = await Promise.allSettled(scenario === "cancel-first" ? [cancel(), process()] : [process(), cancel()]);
        assert.equal(results.filter(result => result.status === "fulfilled").length >= 1, true);
        for (const result of results) {
          if (result.status === "rejected") assert.equal(result.reason.status, 409);
        }
      }
      const [savedOrder, savedProduct, savedVariant, returns] = await Promise.all([
        prisma.order.findUniqueOrThrow({ where: { id: order.id } }),
        prisma.product.findUniqueOrThrow({ where: { id: product.id } }),
        prisma.productVariant.findUniqueOrThrow({ where: { id: variant.id } }),
        prisma.inventoryTransaction.count({ where: { referenceId: order.orderNumber, transactionType: "return" } }),
      ]);
      const invalid = scenario === "invalid-payment";
      assert.equal(savedOrder.orderStatus, invalid ? "confirmed" : "cancelled");
      assert.equal(savedProduct.stockQuantity, invalid ? 8 : 10);
      assert.equal(savedVariant.stockQuantity, invalid ? 8 : 10);
      assert.equal(returns, invalid ? 0 : 1);
      if (!invalid) await assert.rejects(process(), (error: unknown) => error instanceof Error && "status" in error && error.status === 409);
      console.log("PASS:", scenario);
    }
  } finally {
    try {
      await prisma.$transaction(async tx => {
        await tx.inventoryTransaction.deleteMany({ where: { referenceId: { in: orderNumbers } } });
        await tx.order.deleteMany({ where: { id: { in: orderIds } } });
        await tx.product.deleteMany({ where: { categoryId } });
        await tx.category.deleteMany({ where: { id: categoryId } });
      });
    } finally { await prisma.$disconnect(); }
  }
}
run().catch(error => { console.error(error); process.exitCode = 1; });
