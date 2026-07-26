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
