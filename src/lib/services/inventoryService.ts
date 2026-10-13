import { prisma } from "../prisma";
import { Prisma } from "@/generated/prisma/client";

export async function listInventory(params: {
  search?: string;
  status?: "all" | "low" | "out" | "in";
  page?: number;
  limit?: number;
} = {}) {
  const { search, status = "all", page = 1, limit = 25 } = params;

  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  if (search && search.trim() !== "") {
    const term = search.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { sku: { contains: term, mode: "insensitive" } },
      { brand: { contains: term, mode: "insensitive" } },
    ];
  }

  if (status === "out") {
    where.stockQuantity = 0;
  } else if (status === "low" || status === "in") {
    const candidates = await prisma.product.findMany({
      where,
      select: { id: true, stockQuantity: true, lowStockThreshold: true },
    });

    const matchingIds = candidates
      .filter((product) =>
        status === "low"
          ? product.stockQuantity > 0 && product.stockQuantity <= product.lowStockThreshold
          : product.stockQuantity > product.lowStockThreshold
      )
      .map((product) => product.id);

    where.id = { in: matchingIds };
  }

  const skip = (page - 1) * limit;

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        variants: {
          where: { isActive: true },
        },
        inventoryHistories: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
      orderBy: { stockQuantity: "asc" },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products,
    totalCount,
    totalPages: Math.ceil(totalCount / limit),
    currentPage: page,
  };
}

export async function adjustStock(data: {
  productId: string;
  variantId?: string | null;
  quantityChange: number;
  transactionType: "purchase" | "sale" | "adjustment" | "return" | "damaged" | "manual_update";
  notes: string;
}) {
  const { productId, variantId, quantityChange, transactionType, notes } = data;

  return await prisma.$transaction(async (tx) => {
    const dbProduct = await tx.product.findUnique({
      where: { id: productId },
      include: { variants: { where: { isActive: true } } },
    });
    if (!dbProduct) throw new Error("Product not found");

    const hasActiveVariants = dbProduct.variants.length > 0;
    if (hasActiveVariants && !variantId) {
      throw new Error("Select a product variant before adjusting stock for this item.");
    }

    let variant = null;
    if (variantId) {
      variant = dbProduct.variants.find((item) => item.id === variantId) ?? null;
      if (!variant) {
        throw new Error("Selected variant does not belong to this product or is inactive.");
      }
      if (quantityChange < 0 && variant.stockQuantity < Math.abs(quantityChange)) {
        throw new Error("Insufficient variant stock.");
      }
    }

    if (quantityChange < 0 && dbProduct.stockQuantity < Math.abs(quantityChange)) {
      throw new Error(`Insufficient stock. Cannot reduce by ${Math.abs(quantityChange)}.`);
    }

    const updatedProducts = await tx.product.updateMany({
      where: {
        id: productId,
        ...(quantityChange < 0 ? { stockQuantity: { gte: Math.abs(quantityChange) } } : {}),
      },
      data: { stockQuantity: { increment: quantityChange } },
    });

    if (updatedProducts.count === 0) {
      throw new Error("Failed to update stock due to concurrent modification.");
    }

    if (variant) {
      const updatedVariants = await tx.productVariant.updateMany({
        where: {
          id: variant.id,
          productId,
          isActive: true,
          ...(quantityChange < 0 ? { stockQuantity: { gte: Math.abs(quantityChange) } } : {}),
        },
        data: { stockQuantity: { increment: quantityChange } },
      });

      if (updatedVariants.count === 0) {
        throw new Error("Failed to update variant stock due to concurrent modification.");
      }
    }

    const product = await tx.product.findUnique({ where: { id: productId } });

    const history = await tx.inventoryTransaction.create({
      data: {
        productId,
        variantId: variant?.id || null,
        quantity: quantityChange,
        transactionType,
        notes,
      },
    });

    return { product, history };
  });
}

export async function reconcileParentStock(
  productId: string,
  targetStock: number,
  notes = "Reconciled parent stock to active variant totals"
) {
  if (!Number.isSafeInteger(targetStock) || targetStock < 0) {
    throw new Error("Invalid stock reconciliation target");
  }

  return prisma.$transaction(async (tx) => {
    const current = await tx.product.findUnique({
      where: { id: productId },
      select: { id: true, stockQuantity: true },
    });
    if (!current) throw new Error("Product not found");

    const delta = targetStock - current.stockQuantity;
    if (delta === 0) {
      return { product: current, history: null };
    }

    const product = await tx.product.update({
      where: { id: productId },
      data: { stockQuantity: targetStock },
      select: { id: true, stockQuantity: true },
    });

    const history = await tx.inventoryTransaction.create({
      data: {
        productId,
        variantId: null,
        quantity: delta,
        transactionType: "manual_update",
        notes,
      },
    });

    return { product, history };
  });
}

export async function getLowStockAlerts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    include: {
      category: true,
      variants: {
        where: { isActive: true },
      },
    },
  });

  return products.filter(
    (product) => product.stockQuantity <= product.lowStockThreshold
  );
}
