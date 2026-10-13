import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getStoreSettings, updateStoreSettings } from "@/lib/services/settingsService";
import { storeSettingsSchema } from "@/lib/validations/settings";
import { getAdminSession } from "@/lib/auth/jwt";

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({ settings });
  } catch (error: unknown) {
    console.error("Failed to load settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = storeSettingsSchema.parse(body);
    const settings = await updateStoreSettings(validated);

    return NextResponse.json({ success: true, settings });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      const firstIssue = error.issues[0];
      return NextResponse.json(
        {
          error: firstIssue?.message || "Invalid store settings",
          field: firstIssue?.path?.[0] ? String(firstIssue.path[0]) : undefined,
        },
        { status: 400 }
      );
    }

    console.error("Failed to update settings:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
