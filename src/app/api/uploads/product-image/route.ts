import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getAdminSession } from "@/lib/auth/jwt";

const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
]);

function sanitizeFilename(filename: string) {
  const cleaned = filename
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return cleaned || "product-image";
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Only JPG, PNG, WebP, and AVIF images are allowed" },
        { status: 400 }
      );
    }

    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: "Image must be smaller than 4 MB" },
        { status: 400 }
      );
    }

    const safeFilename = sanitizeFilename(file.name);
    const blob = await put(`products/${safeFilename}`, file, {
      access: "public",
      addRandomSuffix: true,
      contentType: file.type,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json({
      success: true,
      image: {
        url: blob.url,
        pathname: blob.pathname,
        contentType: file.type,
        size: file.size,
      },
    });
  } catch (error: unknown) {
    console.error("Product image upload failed:", error);

    const message = error instanceof Error ? error.message : "Image upload failed";
    const storageNotConfigured =
      message.includes("BLOB") ||
      message.includes("token") ||
      message.includes("store");

    return NextResponse.json(
      {
        error: storageNotConfigured
          ? "Product image storage is not configured for this deployment"
          : "Image upload failed",
      },
      { status: 500 }
    );
  }
}
