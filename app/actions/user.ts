"use server";

import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { revalidatePath } from "next/cache";

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
        username: true,
        email: true,
        image: true,
        bio: true,
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

export async function updateUserProfileAction(data: {
  name: string;
  username?: string;
  bio?: string;
  image?: string;
  email?: string;
}) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    // Username uniqueness check
    if (data.username && data.username !== currentUser.username) {
      const existingUsername = await db.user.findUnique({
        where: { username: data.username },
      });

      if (existingUsername) {
        return { success: false, error: "Username is already taken" };
      }
    }

    // Email uniqueness check
    if (data.email && data.email !== currentUser.email) {
      const existingEmail = await db.user.findUnique({
        where: { email: data.email },
      });

      if (existingEmail) {
        return { success: false, error: "Email is already in use by another account" };
      }
    }

    // Update in database
    const updatedUser = await db.user.update({
      where: { id: currentUser.id },
      data: {
        name: data.name.trim(),
        username: data.username ? data.username.trim().toLowerCase() : null,
        bio: data.bio ? data.bio.trim() : null,
        image: data.image !== undefined ? data.image : currentUser.image,
        email: data.email ? data.email.trim().toLowerCase() : currentUser.email,
      },
    });

    revalidatePath("/profile");
    return { success: true, user: updatedUser };
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    return { success: false, error: error.message || "Failed to update profile" };
  }
}

export async function getUserCollectionsAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) return [];

    const collections = await db.collection.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });

    return collections.map((c) => {
      let promptIds: string[] = [];
      try {
        promptIds = JSON.parse(c.promptIds || "[]");
      } catch (_) {}

      return {
        id: c.id,
        name: c.name,
        icon: c.description || "📁",
        promptIds,
        createdAt: c.createdAt.getTime(),
      };
    });
  } catch (error) {
    console.error("Error getting user collections:", error);
    return [];
  }
}

export async function createCollectionAction(name: string, icon = "📁") {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const newCollection = await db.collection.create({
      data: {
        userId: currentUser.id,
        name: name.trim(),
        description: icon,
        promptIds: "[]",
      },
    });

    revalidatePath("/profile");
    return {
      success: true,
      collection: {
        id: newCollection.id,
        name: newCollection.name,
        icon: newCollection.description || "📁",
        promptIds: [],
        createdAt: newCollection.createdAt.getTime(),
      },
    };
  } catch (error: any) {
    console.error("Error creating collection:", error);
    return { success: false, error: error.message || "Failed to create collection" };
  }
}

export async function getUserFavoritesAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return [];

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) return [];

    const favorites = await db.favorite.findMany({
      where: { userId: currentUser.id },
      orderBy: { createdAt: "desc" },
    });

    return favorites.map((f) => ({
      promptId: f.promptId,
      addedAt: f.createdAt.getTime(),
      collectionId: "favorites",
    }));
  } catch (error) {
    console.error("Error getting user favorites:", error);
    return [];
  }
}

export async function toggleFavoriteAction(promptId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    const existing = await db.favorite.findUnique({
      where: {
        userId_promptId: {
          userId: currentUser.id,
          promptId,
        },
      },
    });

    if (existing) {
      await db.favorite.delete({
        where: { id: existing.id },
      });
      revalidatePath("/profile");
      return { success: true, favorited: false };
    } else {
      await db.favorite.create({
        data: {
          userId: currentUser.id,
          promptId,
        },
      });
      revalidatePath("/profile");
      return { success: true, favorited: true };
    }
  } catch (error: any) {
    console.error("Error toggling favorite:", error);
    return { success: false, error: error.message || "Failed to update favorite" };
  }
}

export async function deleteUserAccountAction() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const currentUser = await db.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return { success: false, error: "User not found" };
    }

    await db.user.delete({
      where: { id: currentUser.id },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    return { success: false, error: error.message || "Failed to delete account" };
  }
}

export async function getPromptsByIdsAction(ids: string[]) {
  try {
    if (!ids || ids.length === 0) return [];

    // Check caller's membership from DB to decide whether to strip PRO text
    const session = await getServerSession(authOptions);
    let callerIsPro = false;
    if (session?.user?.email) {
      const caller = await db.user.findUnique({
        where: { email: session.user.email },
        select: { membership: true, role: true },
      });
      callerIsPro = caller?.membership === "PRO" || caller?.role === "ADMIN";
    }

    const prompts = await db.prompt.findMany({
      where: { id: { in: ids } },
    });

    return prompts.map((p) => ({
      ...p,
      accessLevel: (p.accessLevel ?? "FREE") as "FREE" | "PRO",
      // Strip prompt text for PRO prompts when caller is FREE
      prompt: p.accessLevel === "PRO" && !callerIsPro ? "" : p.prompt,
    })) as any[];
  } catch (error) {
    console.error("Error fetching prompts by IDs:", error);
    return [];
  }
}

/**
 * SECURE server action: returns the full prompt text for a PRO prompt.
 * Membership is verified against the DATABASE — never trusted from the client.
 * Returns { success: false, error: "PRO_REQUIRED" } for FREE users (HTTP 403 equivalent).
 */
export async function copyProPromptAction(promptId: string): Promise<
  | { success: true; text: string }
  | { success: false; error: "UNAUTHENTICATED" | "PRO_REQUIRED" | "NOT_FOUND" }
> {
  try {
    // 1. Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "UNAUTHENTICATED" };
    }

    // 2. Verify membership from DB — authoritative, never from JWT/client
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { membership: true, role: true },
    });

    const userIsPro = user?.membership === "PRO" || user?.role === "ADMIN";
    if (!userIsPro) {
      // FREE user attempting to copy a PRO prompt — deny
      return { success: false, error: "PRO_REQUIRED" };
    }

    // 3. Fetch the full prompt text from DB
    const prompt = await db.prompt.findUnique({
      where: { id: promptId },
      select: { prompt: true, accessLevel: true },
    });

    if (!prompt) {
      return { success: false, error: "NOT_FOUND" };
    }

    return { success: true, text: prompt.prompt };
  } catch (error) {
    console.error("Error in copyProPromptAction:", error);
    return { success: false, error: "PRO_REQUIRED" };
  }
}

export async function updateCollectionAction(id: string, name: string, icon?: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const updated = await db.collection.update({
      where: { id },
      data: {
        name: name.trim(),
        description: icon || "📁",
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/collections/${id}`);
    return {
      success: true,
      collection: {
        id: updated.id,
        name: updated.name,
        icon: updated.description || "📁",
        createdAt: updated.createdAt.getTime(),
      },
    };
  } catch (error: any) {
    console.error("Error updating collection:", error);
    return { success: false, error: error.message || "Failed to update collection" };
  }
}

export async function deleteCollectionAction(id: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    await db.collection.delete({
      where: { id },
    });

    revalidatePath("/profile");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting collection:", error);
    return { success: false, error: error.message || "Failed to delete collection" };
  }
}

export async function addPromptToCollectionAction(promptId: string, collectionId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    let promptIds: string[] = [];
    try {
      promptIds = JSON.parse(collection.promptIds || "[]");
    } catch (_) {}

    if (!promptIds.includes(promptId)) {
      promptIds.push(promptId);
    }

    await db.collection.update({
      where: { id: collectionId },
      data: {
        promptIds: JSON.stringify(promptIds),
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/collections/${collectionId}`);
    return { success: true, promptIds };
  } catch (error: any) {
    console.error("Error adding prompt to collection:", error);
    return { success: false, error: error.message || "Failed to add prompt" };
  }
}

export async function removePromptFromCollectionAction(promptId: string, collectionId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    let promptIds: string[] = [];
    try {
      promptIds = JSON.parse(collection.promptIds || "[]");
    } catch (_) {}

    const updatedIds = promptIds.filter((id) => id !== promptId);

    await db.collection.update({
      where: { id: collectionId },
      data: {
        promptIds: JSON.stringify(updatedIds),
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/collections/${collectionId}`);
    return { success: true, promptIds: updatedIds };
  } catch (error: any) {
    console.error("Error removing prompt from collection:", error);
    return { success: false, error: error.message || "Failed to remove prompt" };
  }
}

export async function bulkRemovePromptsFromCollectionAction(promptIdsToRemove: string[], collectionId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return { success: false, error: "Collection not found" };
    }

    let promptIds: string[] = [];
    try {
      promptIds = JSON.parse(collection.promptIds || "[]");
    } catch (_) {}

    const removeSet = new Set(promptIdsToRemove);
    const updatedIds = promptIds.filter((id) => !removeSet.has(id));

    await db.collection.update({
      where: { id: collectionId },
      data: {
        promptIds: JSON.stringify(updatedIds),
      },
    });

    revalidatePath("/profile");
    revalidatePath(`/collections/${collectionId}`);
    return { success: true, promptIds: updatedIds };
  } catch (error: any) {
    console.error("Error bulk removing prompts:", error);
    return { success: false, error: error.message || "Failed to bulk remove prompts" };
  }
}

export async function bulkMovePromptsAction(promptIdsToMove: string[], sourceColId: string, targetColId: string) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: "Unauthorized" };
    }

    // 1. Remove from source collection
    const sourceCol = await db.collection.findUnique({ where: { id: sourceColId } });
    if (sourceCol) {
      let srcIds: string[] = [];
      try { srcIds = JSON.parse(sourceCol.promptIds || "[]"); } catch (_) {}
      const moveSet = new Set(promptIdsToMove);
      const newSrcIds = srcIds.filter((id) => !moveSet.has(id));
      await db.collection.update({
        where: { id: sourceColId },
        data: { promptIds: JSON.stringify(newSrcIds) },
      });
    }

    // 2. Add to target collection
    const targetCol = await db.collection.findUnique({ where: { id: targetColId } });
    if (targetCol) {
      let tgtIds: string[] = [];
      try { tgtIds = JSON.parse(targetCol.promptIds || "[]"); } catch (_) {}
      const existingSet = new Set(tgtIds);
      promptIdsToMove.forEach((id) => {
        if (!existingSet.has(id)) tgtIds.push(id);
      });
      await db.collection.update({
        where: { id: targetColId },
        data: { promptIds: JSON.stringify(tgtIds) },
      });
    }

    revalidatePath("/profile");
    revalidatePath(`/collections/${sourceColId}`);
    revalidatePath(`/collections/${targetColId}`);
    return { success: true };
  } catch (error: any) {
    console.error("Error bulk moving prompts:", error);
    return { success: false, error: error.message || "Failed to bulk move prompts" };
  }
}

export async function getCollectionDetailsAction(collectionId: string) {
  try {
    const session = await getServerSession(authOptions);
    let callerIsPro = false;
    if (session?.user?.email) {
      const user = await db.user.findUnique({
        where: { email: session.user.email },
        select: { membership: true, role: true },
      });
      callerIsPro = user?.membership === "PRO" || user?.role === "ADMIN";
    }

    const collection = await db.collection.findUnique({
      where: { id: collectionId },
    });

    if (!collection) {
      return null;
    }

    let promptIds: string[] = [];
    try {
      promptIds = JSON.parse(collection.promptIds || "[]");
    } catch (_) {}

    // Efficient single query for all prompts in collection
    const prompts = promptIds.length > 0
      ? await db.prompt.findMany({
          where: { id: { in: promptIds } },
        })
      : [];

    // Map prompts in exact promptIds order & mask PRO prompts if caller is FREE
    const promptMap = new Map(prompts.map((p) => [p.id, p]));
    const orderedPrompts = promptIds
      .map((id) => promptMap.get(id))
      .filter((p): p is typeof prompts[0] => Boolean(p))
      .map((p) => ({
        ...p,
        accessLevel: (p.accessLevel ?? "FREE") as "FREE" | "PRO",
        prompt: p.accessLevel === "PRO" && !callerIsPro ? "" : p.prompt,
      }));

    const freeCount = orderedPrompts.filter((p) => p.accessLevel === "FREE").length;
    const proCount = orderedPrompts.filter((p) => p.accessLevel === "PRO").length;

    return {
      id: collection.id,
      name: collection.name,
      icon: collection.description || "📁",
      createdAt: collection.createdAt.getTime(),
      updatedAt: collection.updatedAt.getTime(),
      promptIds,
      prompts: orderedPrompts as any[],
      stats: {
        totalPrompts: orderedPrompts.length,
        freeCount,
        proCount,
      },
    };
  } catch (error) {
    console.error("Error fetching collection details:", error);
    return null;
  }
}

