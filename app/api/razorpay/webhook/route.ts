import { NextResponse } from "next/server";
import { verifyRazorpaySignature } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (webhookSecret && signature) {
      const isValid = verifyRazorpaySignature(rawBody, signature, webhookSecret);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid Webhook Signature" }, { status: 400 });
      }
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;

    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload.payment.entity;
      const userEmail = paymentEntity.notes?.userEmail;
      const plan = paymentEntity.notes?.plan || "PRO";

      if (userEmail) {
        await prisma.user.update({
          where: { email: userEmail },
          data: {
            membership: plan,
            plan: plan.toLowerCase(),
          },
        });
      }
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Razorpay webhook processing error:", error);
    return NextResponse.json({ error: "Webhook Error" }, { status: 500 });
  }
}
