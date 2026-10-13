export const ORDER_STATUS_TRANSITIONS: Record<string, ReadonlySet<string>> = {
  pending: new Set(["pending", "confirmed", "cancelled"]),
  confirmed: new Set(["confirmed", "processing", "cancelled"]),
  processing: new Set(["processing", "shipped", "cancelled"]),
  shipped: new Set(["shipped", "delivered"]),
  delivered: new Set(["delivered"]),
  cancelled: new Set(["cancelled"]),
};

export const PAYMENT_STATUSES = new Set(["pending", "paid", "failed", "refunded"]);

export class OrderUpdateError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "OrderUpdateError";
    this.status = status;
  }
}
