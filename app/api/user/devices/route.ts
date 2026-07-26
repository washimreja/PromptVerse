import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET active devices/sessions for the authenticated user
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, membership: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { lastActive: "desc" },
      select: {
        id: true,
        deviceName: true,
        browser: true,
        os: true,
        ip: true,
        lastActive: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      sessions,
      membership: user.membership,
      maxDevices: user.membership === "PRO" || user.membership === "LIFETIME" ? 3 : 1,
    });
  } catch (error) {
    console.error("Failed to fetch user sessions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE a specific active session (Revoke device access)
export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { sessionId } = await request.json();
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify session belongs to user before deleting
    await prisma.session.deleteMany({
      where: {
        id: sessionId,
        userId: user.id,
      },
    });

    return NextResponse.json({ success: true, message: "Session revoked successfully" });
  } catch (error) {
    console.error("Failed to revoke session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
