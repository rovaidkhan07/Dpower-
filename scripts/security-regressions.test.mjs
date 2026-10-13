// Dependency-free service/route regression tests. Prisma and framework boundaries
// are doubles; PostgreSQL locking must also be verified by test-order-status.ts.
import { test, beforeEach } from "node:test";
import assert from "node:assert/strict";
import { registerHooks, stripTypeScriptTypes } from "node:module";
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import crypto from "node:crypto";
import path from "node:path";

const root = fileURLToPath(new URL("../", import.meta.url));
let state;
let lockTail;
const clone = value => structuredClone(value);
const db = {
  user: { findUnique: async () => clone(state.user) },
  order: { findMany: async args => { state.orderQuery = args; return []; },
    aggregate: async () => ({ _count: { _all: 0 }, _sum: { total: null } }),
    groupBy: async () => [] },
  async $transaction(callback) {
    let release;
    let snapshot;
    const tx = {
      async $queryRaw() {
        const previous = lockTail;
        lockTail = new Promise(resolve => { release = resolve; });
        await previous;
        snapshot = clone(state);
        return state.order ? [{ id: state.order.id }] : [];
      },
      order: {
        findUnique: async () => clone(state.order),
        update: async ({ data }) => {
          Object.assign(state.order, data);
          return clone(state.order);
        },
      },
      product: { update: async ({ data }) => { state.stock += data.stockQuantity.increment; } },
      productVariant: { update: async ({ data }) => { state.variantStock += data.stockQuantity.increment; } },
      inventoryTransaction: { create: async ({ data }) => {
        if (state.failInventory) throw new Error("Simulated inventory write failure");
        state.inventory.push(data);
      } },
    };
    try { return await callback(tx); }
    catch (error) { if (snapshot) state = snapshot; throw error; }
    finally { release?.(); }
  },
};
globalThis.__securityTestDb = db;
globalThis.__securityTestSession = { id: "customer", role: "customer" };

const mocks = {
  prisma: "export const prisma = globalThis.__securityTestDb;",
  utils: "export const generateOrderNumber = () => 'TEST-ORDER';",
  next: "export class NextRequest extends Request {} export const NextResponse = { json: (body, init) => Response.json(body, init) };",
  headers: "export const cookies = async () => ({get: () => undefined});",
  // JWT decoding is mocked; these tests exercise database revocation, not jose.
  jose: "export class SignJWT {} export const jwtVerify = async token => ({payload: JSON.parse(token)});",
  bcrypt: "export default {hash: async () => 'test-hash', compare: async () => true};",
  session: "export const getCustomerSession = async () => globalThis.__securityTestSession;",
};
registerHooks({
  resolve(specifier, context, nextResolve) {
    let mock;
    if (specifier === "@/lib/prisma" || specifier === "../prisma") mock = "prisma";
    else if (specifier === "../utils") mock = "utils";
    else if (specifier === "next/server") mock = "next";
    else if (specifier === "next/headers") mock = "headers";
    else if (specifier === "jose") mock = "jose";
    else if (specifier === "bcryptjs") mock = "bcrypt";
    else if (specifier === "@/lib/auth/jwt") mock = "session";
    if (mock) return { url: "security-mock:" + mock, shortCircuit: true };
    if (specifier.startsWith(".") && context.parentURL?.startsWith("file:")) {
      const resolved = new URL(specifier, context.parentURL);
      if (!path.extname(resolved.pathname)) resolved.pathname += ".ts";
      return { url: resolved.href, shortCircuit: true };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith("security-mock:")) {
      return { format: "module", source: mocks[url.slice(14)], shortCircuit: true };
    }
    if (url.endsWith(".ts")) {
      return { format: "module", source: stripTypeScriptTypes(readFileSync(fileURLToPath(url), "utf8")), shortCircuit: true };
    }
    return nextLoad(url, context);
  },
});
const { updateOrderAdmin } = await import(pathToFileURL(path.join(root, "src/lib/services/orderService.ts")));
const { encryptTrackingToken, decryptTrackingToken } = await import(pathToFileURL(path.join(root, "src/lib/auth/tracking-crypto.ts")));
const { verifySessionToken } = await import(pathToFileURL(path.join(root, "src/lib/auth/jwt.ts")));
const { GET: customerOrders } = await import(pathToFileURL(path.join(root, "src/app/api/auth/customer/orders/route.ts")));

beforeEach(() => {
  state = {
    order: { id: "order", orderNumber: "TEST", orderStatus: "confirmed", paymentStatus: "pending",
      items: [{ productId: "product", variantId: "variant", quantity: 2 }] },
    stock: 8, variantStock: 8, inventory: [],
    user: { id: "customer", email: "test@example.invalid", name: "Test", phone: null, role: "customer", sessionVersion: 0 },
  };
  lockTail = Promise.resolve();
  process.env.JWT_SECRET = "test-only-jwt-secret";
  delete process.env.TRACKING_ENCRYPTION_KEYS;
  delete process.env.TRACKING_ENCRYPTION_ACTIVE_VERSION;
  delete process.env.TRACKING_LEGACY_SECRET;
});

test("cancel/process race preserves terminal cancellation and stock", async () => {
  const results = await Promise.allSettled([
    updateOrderAdmin("order", { orderStatus: "cancelled" }),
    updateOrderAdmin("order", { orderStatus: "processing" }),
  ]);
  assert.equal(results[0].status, "fulfilled");
  assert.equal(results[1].status, "rejected");
  assert.equal(results[1].reason.status, 409);
  assert.equal(state.order.orderStatus, "cancelled");
  assert.equal(state.stock, 10);
  assert.equal(state.variantStock, 10);
});
test("process/cancel race remains consistent in the opposite ordering", async () => {
  await Promise.all([
    updateOrderAdmin("order", { orderStatus: "processing" }),
    updateOrderAdmin("order", { orderStatus: "cancelled" }),
  ]);
  assert.equal(state.order.orderStatus, "cancelled");
  assert.equal(state.stock, 10);
  assert.equal(state.inventory.length, 1);
});
test("concurrent repeated cancellations restore stock exactly once", async () => {
  await Promise.all(Array.from({ length: 8 }, () => updateOrderAdmin("order", { orderStatus: "cancelled" })));
  assert.equal(state.stock, 10);
  assert.equal(state.variantStock, 10);
  assert.equal(state.inventory.length, 1);
});
test("invalid combined update leaves status and stock untouched", async () => {
  await assert.rejects(updateOrderAdmin("order", { orderStatus: "cancelled", paymentStatus: "invalid" }));
  assert.equal(state.order.orderStatus, "confirmed");
  assert.equal(state.stock, 8);
});
test("inventory failure rolls back cancellation", async () => {
  state.failInventory = true;
  await assert.rejects(updateOrderAdmin("order", { orderStatus: "cancelled" }));
  assert.equal(state.order.orderStatus, "confirmed");
  assert.equal(state.stock, 8);
  assert.equal(state.variantStock, 8);
});
test("payment and status are saved together", async () => {
  const order = await updateOrderAdmin("order", { orderStatus: "processing", paymentStatus: "paid" });
  assert.equal(order.orderStatus, "processing");
  assert.equal(order.paymentStatus, "paid");
});
test("session version rejects pre-reset and deleted-user sessions", async () => {
  const old = JSON.stringify({ id: "customer", role: "customer", sessionVersion: 0 });
  assert.ok(await verifySessionToken(old));
  state.user.sessionVersion = 1;
  assert.equal(await verifySessionToken(old), null);
  assert.equal(await verifySessionToken(JSON.stringify({ id: "customer" })), null);
  assert.ok(await verifySessionToken(JSON.stringify({ id: "customer", sessionVersion: 1 })));
  state.user = null;
  assert.equal(await verifySessionToken(old), null);
});
test("session uses current database role, never stale JWT role", async () => {
  const session = await verifySessionToken(JSON.stringify({ id: "customer", role: "admin", sessionVersion: 0 }));
  assert.equal(session.role, "customer");
});
test("customer orders select omits internal security fields and disables caching", async () => {
  const response = await customerOrders(new Request("https://example.invalid/api/auth/customer/orders"));
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.deepEqual(state.orderQuery.where, { customerId: "customer" });
  for (const field of ["trackingToken", "trackingTokenCiphertext", "idempotencyKey", "idempotencyRequestHash", "notes"]) {
    assert.equal(state.orderQuery.select[field], undefined);
  }
});
test("tracking key rotation preserves old versions independently of JWT secret", () => {
  const v1 = crypto.randomBytes(32).toString("base64");
  const v2 = crypto.randomBytes(32).toString("base64");
  process.env.TRACKING_ENCRYPTION_KEYS = JSON.stringify({ v1, v2 });
  process.env.TRACKING_ENCRYPTION_ACTIVE_VERSION = "v1";
  const old = encryptTrackingToken("tracking-token");
  process.env.TRACKING_ENCRYPTION_ACTIVE_VERSION = "v2";
  process.env.JWT_SECRET = "rotated-jwt-secret";
  assert.equal(decryptTrackingToken(old), "tracking-token");
  assert.equal(decryptTrackingToken(encryptTrackingToken("new-token")), "new-token");
  const parts = old.split(".");
  parts[2] = crypto.randomBytes(16).toString("base64url");
  assert.equal(decryptTrackingToken(parts.join(".")), null);
});
test("legacy tracking tokens survive JWT rotation with retained legacy secret", () => {
  const old = encryptTrackingToken("legacy-token");
  process.env.TRACKING_LEGACY_SECRET = process.env.JWT_SECRET;
  process.env.JWT_SECRET = "rotated-jwt-secret";
  assert.equal(decryptTrackingToken(old), "legacy-token");
});
