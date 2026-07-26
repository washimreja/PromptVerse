import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { razorpay } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { plan, amount, currency = "INR" } = await request.json();

    // Create a Razorpay Order (amount in smallest currency unit, e.g. paise)
    const options = {
      amount: Math.round((amount || 9.99) * 100),
      currency: currency,
      receipt: `receipt_${Date.now()}`,
      notes: {
        userEmail: session.user.email,
        plan: plan || "PRO",
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error("Razorpay create-order failed:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
