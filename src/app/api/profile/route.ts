import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.BETTER_AUTH_MONGODB_URL as string);

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await client.connect();
    const db = client.db("WonderLust");
    const userDoc = await db.collection("user").findOne({ id: session.user.id }) as {
      address?: string;
      country?: string;
      birthDate?: string;
    } | null;

    return NextResponse.json({
      address: userDoc?.address || "",
      country: userDoc?.country || "",
      birthDate: userDoc?.birthDate || "",
    });
  } catch (err) {
    console.error("Failed to fetch user profile details:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { address, country, birthDate, image } = body;

    await client.connect();
    const db = client.db("WonderLust");

    const updateFields: Record<string, string> = {};
    if (address !== undefined) updateFields.address = String(address).trim();
    if (country !== undefined) updateFields.country = String(country).trim();
    if (birthDate !== undefined) updateFields.birthDate = String(birthDate).trim();
    if (image !== undefined) updateFields.image = String(image).trim();

    if (Object.keys(updateFields).length > 0) {
      await db.collection("user").updateOne(
        { id: session.user.id },
        { $set: updateFields }
      );
    }

    return NextResponse.json({
      success: true,
      address: updateFields.address,
      country: updateFields.country,
      birthDate: updateFields.birthDate,
    });
  } catch (err) {
    console.error("Failed to update profile details:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
