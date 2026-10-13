import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getProductById, updateProduct, deleteProduct } from "@/lib/services/productService";
import { reconcileParentStock } from "@/lib/services/inventoryService";
import { productSchema } from "@/lib/validations/product";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductById(id);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error("Failed to fetch product:", error);
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
    const existing = await getProductById(id);
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const body = await req.json();
    const validated = productSchema.parse(body);

    if (validated.stockQuantity !== existing.stockQuantity) {
      return NextResponse.json(
        { error: "Stock cannot be changed from Product Edit. Use Inventory → Adjust Stock so the change is recorded in inventory history." },
        { status: 400 }
      );
    }

    const existingVariants = new Map(existing.variants.map((variant) => [variant.id, variant]));
    const incomingIds = new Set<string>();

    for (const variant of validated.variants) {
      if (variant.id) {
        const currentVariant = existingVariants.get(variant.id);
        if (!currentVariant) {
          return NextResponse.json({ error: "Invalid product variant." }, { status: 400 });
        }
        incomingIds.add(variant.id);
        if (variant.stockQuantity !== currentVariant.stockQuantity) {
          return NextResponse.json(
            { error: `Stock for variant "${currentVariant.name}" cannot be changed from Product Edit. Use Inventory → Adjust Stock.` },
            { status: 400 }
          );
        }
      } else if (variant.stockQuantity !== 0) {
        return NextResponse.json(
          { error: `New variant "${variant.name}" must start with 0 stock. Create it first, then add stock from Inventory.` },
          { status: 400 }
        );
      }
    }

    for (const currentVariant of existing.variants) {
      if (currentVariant.isActive && !incomingIds.has(currentVariant.id) && currentVariant.stockQuantity > 0) {
        return NextResponse.json(
          { error: `Variant "${currentVariant.name}" still has ${currentVariant.stockQuantity} units. Reduce it to 0 in Inventory before removing it.` },
          { status: 400 }
        );
      }
    }

    const normalizedStock = validated.variants.length > 0
      ? validated.variants
          .filter((variant) => variant.isActive !== false)
          .reduce((sum, variant) => sum + variant.stockQuantity, 0)
      : validated.stockQuantity;

    if (normalizedStock !== existing.stockQuantity) {
      await reconcileParentStock(
        id,
        normalizedStock,
        `System reconciliation before product edit: parent stock aligned to active variant total (${normalizedStock})`
      );
    }

    const updated = await updateProduct(id, {
      ...validated,
      stockQuantity: normalizedStock,
    });
    return NextResponse.json({ success: true, product: updated });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message || "Validation failed",
          field: firstIssue?.path?.length ? firstIssue.path.join(".") : undefined,
        },
        { status: 400 }
      );
    }
    console.error("Failed to update product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await deleteProduct(id);
    return NextResponse.json({ success: true, message: "Product deactivated/deleted" });
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
