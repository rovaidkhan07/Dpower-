import "dotenv/config";
import { prisma } from "../lib/prisma";
import { getProducts, getProductBySlug } from "../src/lib/services/productService";
import { createOrderAtomic, updateOrderStatus } from "../src/lib/services/orderService";
import { adjustStock } from "../src/lib/services/inventoryService";
import { getDashboardMetrics } from "../src/lib/services/analyticsService";
import { comparePassword } from "../src/lib/auth/jwt";
import { assertSafeDestructiveTestEnvironment } from "./test-safety";

async function runTests() {
  assertSafeDestructiveTestEnvironment();
  console.log("🚀 Starting MobileHub E2E Business Logic & API Tests...\n");

  let passed = 0;
  let failed = 0;
  let exitCode = 0;
  let testOrderId: string | null = null;
  let testOrderNumber: string | null = null;
  let manualAdjustment: { productId: string; historyId: string; quantity: number } | null = null;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName}`);
      failed++;
    }
  }

  try {
    // 1. Catalog & Search Tests
    console.log("📦 1. Testing Catalog & Products Service...");
    const productsResult = await getProducts({ limit: 10 });
    assert(productsResult.products.length > 0, "Fetch active products list");
    assert(productsResult.totalCount >= 20, "Total seeded product count >= 20");

    const searchResult = await getProducts({ search: "Anker" });
    assert(
      searchResult.products.every((p) => p.name.includes("Anker") || p.brand.includes("Anker") || p.description.includes("Anker")),
      "Search filtering by keyword 'Anker'"
    );

    const chargerProd = await getProductBySlug("anker-312-20w-fast-charger");
    assert(chargerProd !== null, "Fetch product by SEO slug");
    assert(chargerProd?.variants.length === 2, "Product variants loaded correctly");

    // 2. Pricing & Atomic Order Creation Test
    console.log("\n🛒 2. Testing Atomic Order Placement & Stock Decrement...");
    if (!chargerProd) throw new Error("Charger product not found");

    const initialStock = chargerProd.stockQuantity;
    const testItemQty = 2;

    const testOrder = await createOrderAtomic({
      customerName: "Automated QA Test",
      customerPhone: "03009998877",
      customerEmail: "qa.test@mobilehub.pk",
      shippingAddress: "Street 5, Test Plaza, Karachi",
      city: "Karachi",
      postalCode: "75000",
      notes: "E2E Automated test order",
      paymentMethod: "cod",
      items: [
        {
          productId: chargerProd.id,
          variantId: chargerProd.variants[0]?.id || null,
          quantity: testItemQty,
        },
      ],
    });

    testOrderId = testOrder.id;
    testOrderNumber = testOrder.orderNumber;

    assert(testOrder.orderNumber.startsWith("ORD-"), `Order number format valid: ${testOrder.orderNumber}`);
    assert(testOrder.items.length === 1, "Order items snapshot created");

    const updatedProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      updatedProd?.stockQuantity === initialStock - testItemQty,
      `Stock accurately decremented: ${initialStock} -> ${updatedProd?.stockQuantity}`
    );

    const invTx = await prisma.inventoryTransaction.findFirst({
      where: { referenceId: testOrder.orderNumber },
    });
    assert(invTx !== null && invTx.quantity === -testItemQty, "Inventory audit transaction logged");

    console.log("\n🔄 3. Testing Order Status Updates & Stock Restoration...");
    await updateOrderStatus(testOrder.id, "cancelled", "Cancelled by test");
    const restoredProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      restoredProd?.stockQuantity === initialStock,
      `Stock accurately restored on cancellation: ${restoredProd?.stockQuantity} == ${initialStock}`
    );

    console.log("\n🔐 4. Testing Admin Authentication...");
    const adminEmail = process.env.ADMIN_EMAIL || "admin@Kharidly.pk";
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123@Kharidly";
    const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
    assert(adminUser !== null && adminUser.role === "admin", "Admin account seeded in database");

    const validPass = await comparePassword(adminPassword, adminUser!.passwordHash);
    assert(validPass === true, "Admin password hash verification succeeds");

    const invalidPass = await comparePassword("wrongpassword", adminUser!.passwordHash);
    assert(invalidPass === false, "Invalid password correctly rejected");

    console.log("\n📊 5. Testing Dashboard Analytics Calculation...");
    const metrics = await getDashboardMetrics();
    assert(typeof metrics.totalRevenue === "number" && metrics.totalRevenue > 0, "Total revenue calculated from orders");
    assert(metrics.totalOrders > 0, "Total orders counted");

    console.log("\n📦 6. Testing Manual Inventory Adjustment...");
    const adjustmentQuantity = 15;
    const adjustmentResult = await adjustStock({
      productId: chargerProd.id,
      quantityChange: adjustmentQuantity,
      transactionType: "purchase",
      notes: "Received new supplier shipment batch #TEST",
    });

    manualAdjustment = {
      productId: chargerProd.id,
      historyId: adjustmentResult.history.id,
      quantity: adjustmentQuantity,
    };

    const adjustedProd = await prisma.product.findUnique({ where: { id: chargerProd.id } });
    assert(
      adjustedProd?.stockQuantity === initialStock + adjustmentQuantity,
      `Manual stock increment verified: ${adjustedProd?.stockQuantity}`
    );

    console.log(`\n========================================`);
    console.log(`🎯 Test Summary: ${passed} Passed, ${failed} Failed`);
    console.log(`========================================\n`);

    if (failed > 0) {
      exitCode = 1;
    }
  } catch (error) {
    console.error("❌ Test suite encountered error:", error);
    exitCode = 1;
  } finally {
    try {
      if (manualAdjustment) {
        const adjustment = manualAdjustment;
        await prisma.$transaction(async (tx) => {
          await tx.product.update({
            where: { id: adjustment.productId },
            data: { stockQuantity: { decrement: adjustment.quantity } },
          });
          await tx.inventoryTransaction.deleteMany({
            where: { id: adjustment.historyId },
          });
        });
        console.log("🧹 Reversed manual inventory mutation created by the E2E suite.");
      }

      if (testOrderId) {
        const orderId = testOrderId;
        const orderNumber = testOrderNumber;
        const currentOrder = await prisma.order.findUnique({
          where: { id: orderId },
          select: { orderStatus: true },
        });

        if (currentOrder && currentOrder.orderStatus !== "cancelled") {
          await updateOrderStatus(orderId, "cancelled", "E2E cleanup after test run");
        }

        await prisma.$transaction(async (tx) => {
          if (orderNumber) {
            await tx.inventoryTransaction.deleteMany({
              where: { referenceId: orderNumber },
            });
          }
          await tx.order.deleteMany({ where: { id: orderId } });
        });
        console.log("🧹 Removed temporary E2E order and its inventory audit rows.");
      }
    } catch (cleanupError) {
      console.error("❌ E2E cleanup failed:", cleanupError);
      exitCode = 1;
    } finally {
      await prisma.$disconnect();
    }
  }

  process.exitCode = exitCode;
}

runTests();
