import { NextResponse } from "next/server";
import { getOrderById, updateOrderAdmin } from "@/lib/services/orderService";
import { getAdminSession } from "@/lib/auth/jwt";

import { ORDER_STATUS_TRANSITIONS, PAYMENT_STATUSES, OrderUpdateError } from "@/lib/services/order-status";

const ALLOWED_ORDER_STATUSES = new Set(Object.keys(ORDER_STATUS_TRANSITIONS));
const ALLOWED_PAYMENT_STATUSES = PAYMENT_STATUSES;

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const order = await getOrderById(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error: unknown) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body: unknown = await req.json();

    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }

    const { orderStatus, paymentStatus, notes } = body as Record<string, unknown>;

    if (
      (orderStatus !== undefined && (typeof orderStatus !== "string" || !ALLOWED_ORDER_STATUSES.has(orderStatus))) ||
      (paymentStatus !== undefined && (typeof paymentStatus !== "string" || !ALLOWED_PAYMENT_STATUSES.has(paymentStatus))) ||
      (notes !== undefined && (typeof notes !== "string" || notes.length > 2000)) ||
      (orderStatus === undefined && paymentStatus === undefined)
    ) {
      return NextResponse.json({ error: "Invalid order update" }, { status: 400 });
    }

    const updatedOrder = await updateOrderAdmin(id, {
      orderStatus: typeof orderStatus === "string" ? orderStatus : undefined,
      paymentStatus: typeof paymentStatus === "string" ? paymentStatus : undefined,
      notes: typeof notes === "string" ? notes : undefined,
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: unknown) {
    if (error instanceof OrderUpdateError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error("Failed to update order:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

