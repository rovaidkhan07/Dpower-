import "dotenv/config";
import assert from "node:assert/strict";
import { randomUUID, randomBytes } from "node:crypto";
import { prisma } from "../lib/prisma";
import { createOrderAtomic } from "../src/lib/services/orderService";
import { POST as trackOrderApi } from "../src/app/api/track-order/route";
import { assertSafeDestructiveTestEnvironment } from "./test-safety";

async function runTrackingTests() {
  assertSafeDestructiveTestEnvironment();
  const categoryId = randomUUID();
  const createdOrderIds: string[] = [];
  const createdOrderNumbers: string[] = [];
  try {
    await prisma.category.create({ data: { id: categoryId, name: "Tracking regression", slug: categoryId } });
    const productId = randomUUID();
    const product = await prisma.product.create({ data: {
      name: "Isolated tracking test", slug: productId, sku: productId,
      description: "Temporary regression fixture", brand: "Test", categoryId,
      price: 100, stockQuantity: 10,
    } });
    const checkout = {
      customerName: "Tracking Test", customerPhone: "03001234567",
      shippingAddress: "Temporary Test Street", city: "Karachi",
      paymentMethod: "cod" as const, idempotencyKey: randomUUID(),
      items: [{ productId: product.id, quantity: 1 }],
    };
    const order = await createOrderAtomic(checkout);
    createdOrderIds.push(order.id);
    createdOrderNumbers.push(order.orderNumber);
    assert.ok(order.trackingToken);
    const retry = await createOrderAtomic(checkout);
    assert.equal(retry.id, order.id);
    assert.equal(retry.trackingToken, order.trackingToken);
    const stock = await prisma.product.findUniqueOrThrow({ where: { id: product.id } });
    assert.equal(stock.stockQuantity, 9);
    await assert.rejects(createOrderAtomic({ ...checkout, city: "Lahore" }));

    async function track(body: unknown) {
      return trackOrderApi(new Request("https://example.invalid/api/track-order", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
      }));
    }
    const response = await track({ token: order.trackingToken });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "private, no-store");
    const payload = await response.json();
    assert.equal(payload.order.orderNumber, order.orderNumber);
    for (const field of ["shippingAddress", "customerPhone", "customerEmail", "customerName",
      "trackingToken", "trackingTokenCiphertext", "idempotencyKey", "idempotencyRequestHash"]) {
      assert.equal(field in payload.order, false, `Tracking must omit ${field}`);
    }
    assert.equal((await track({ token: randomBytes(32).toString("base64url") })).status, 404);
    assert.equal((await track({ token: "invalid" })).status, 404);
    assert.equal((await track({})).status, 404);
    assert.equal((await track({ orderNumber: order.orderNumber, phone: checkout.customerPhone })).status, 404);
    console.log("PASS: actual token tracking handler, privacy, checkout retry, and conflict checks");
  } finally {
    try {
      await prisma.$transaction(async tx => {
        await tx.inventoryTransaction.deleteMany({ where: { referenceId: { in: createdOrderNumbers } } });
        await tx.order.deleteMany({ where: { id: { in: createdOrderIds } } });
        await tx.product.deleteMany({ where: { categoryId } });
        await tx.category.deleteMany({ where: { id: categoryId } });
      });
    } finally { await prisma.$disconnect(); }
  }
}
runTrackingTests().catch(error => { console.error(error); process.exitCode = 1; });

