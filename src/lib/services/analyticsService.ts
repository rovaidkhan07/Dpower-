import { prisma } from "../prisma";

export async function getDashboardMetrics() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [
    totalOrders,
    pendingOrders,
    deliveredOrders,
    deliveredRevenue,
    todayDeliveredRevenue,
    monthDeliveredRevenue,
    allProducts,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { orderStatus: "pending" } }),
    prisma.order.count({ where: { orderStatus: "delivered" } }),
    prisma.order.aggregate({
      where: { orderStatus: "delivered" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfToday },
        orderStatus: "delivered",
      },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: {
        createdAt: { gte: startOfMonth },
        orderStatus: "delivered",
      },
      _sum: { total: true },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, stockQuantity: true, lowStockThreshold: true },
    }),
  ]);

  const totalRevenue = deliveredRevenue._sum.total ?? 0;
  const todayRevenue = todayDeliveredRevenue._sum.total ?? 0;
  const monthRevenue = monthDeliveredRevenue._sum.total ?? 0;

  const lowStockCount = allProducts.filter(
    (p) => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold
  ).length;

  const outOfStockCount = allProducts.filter((p) => p.stockQuantity === 0).length;

  return {
    totalRevenue,
    todayRevenue,
    monthRevenue,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    totalProducts: allProducts.length,
    lowStockCount,
    outOfStockCount,
  };
}

export async function getRevenueTrends(days = 7) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const orders = await prisma.order.findMany({
    where: {
      createdAt: { gte: startDate },
      orderStatus: "delivered",
    },
    select: {
      total: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  const dateMap: Record<string, { date: string; revenue: number; orders: number }> = {};

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    dateMap[key] = { date: key, revenue: 0, orders: 0 };
  }

  for (const order of orders) {
    const key = new Date(order.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
    if (dateMap[key]) {
      dateMap[key].revenue += order.total;
      dateMap[key].orders += 1;
    }
  }

  return Object.values(dateMap);
}

export async function getOrdersByStatus() {
  const grouped = await prisma.order.groupBy({
    by: ["orderStatus"],
    _count: {
      id: true,
    },
  });

  const statusColors: Record<string, string> = {
    pending: "#f59e0b",
    confirmed: "#3b82f6",
    processing: "#8b5cf6",
    shipped: "#06b6d4",
    delivered: "#10b981",
    cancelled: "#ef4444",
  };

  return grouped.map((g) => ({
    name: g.orderStatus.charAt(0).toUpperCase() + g.orderStatus.slice(1),
    value: g._count.id,
    color: statusColors[g.orderStatus] || "#94a3b8",
  }));
}

export async function getTopSellingProducts(limit = 5) {
  const topItems = await prisma.orderItem.groupBy({
    by: ["productId", "productNameSnapshot"],
    where: {
      order: {
        orderStatus: "delivered",
      },
    },
    _sum: {
      quantity: true,
      totalPrice: true,
    },
    orderBy: {
      _sum: {
        quantity: "desc",
      },
    },
    take: limit,
  });

  return topItems.map((item) => ({
    productId: item.productId,
    name: item.productNameSnapshot,
    unitsSold: item._sum.quantity || 0,
    totalRevenue: item._sum.totalPrice || 0,
  }));
}
