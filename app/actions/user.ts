"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function getUserProfile() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return null;
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: true,
        membership: true,
        createdAt: true,
      }
    });

    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

export async function getPromptsByIdsAction(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return [];
    const prompts = await db.prompt.findMany({
      where: {
        id: { in: ids },
      },
    });

    return prompts.map((p) => ({
      ...p,
      isPro: p.isTrending && p.copyCount > 1800,
    })) as any[];
  } catch (error) {
    console.error("Error fetching prompts by IDs:", error);
    return [];
  }
}
