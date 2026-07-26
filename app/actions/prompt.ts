"use server";

import { db } from "@/lib/db";
import { getUserProfile } from "@/app/actions/user";
import { v2 as cloudinary } from "cloudinary";
import { revalidatePath } from "next/cache";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Helper to generate a clean, unique slug from a title */
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // remove special chars
    .replace(/\s+/g, "-")         // replace spaces with hyphens
    .replace(/-+/g, "-")          // deduplicate hyphens
    .trim();
  
  const randSuffix = Math.random().toString(36).substring(2, 6);
  return `${baseSlug}-${randSuffix}`;
}

export async function createPromptAction(prevState: any, formData: FormData) {
  try {
    // 1. Verify Admin Status
    const user = await getUserProfile();
    if (!user || user.role !== "ADMIN") {
      return { success: false, error: "Unauthorized. Admin access required." };
    }

    // 2. Parse Form Fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const promptText = formData.get("prompt") as string;
    const negativePrompt = (formData.get("negativePrompt") as string) || null;
    const category = formData.get("category") as string;
    const subCategory = (formData.get("subCategory") as string) || null;
    const model = formData.get("model") as string;
    
    const difficultyVal = parseInt(formData.get("difficulty") as string) || 1;
    const qualityVal = parseInt(formData.get("quality") as string) || 5;
    
    const estimatedTime = (formData.get("estimatedTime") as string) || null;
    const style = (formData.get("style") as string) || null;
    const camera = (formData.get("camera") as string) || null;
    const lighting = (formData.get("lighting") as string) || null;
    const aspectRatio = (formData.get("aspectRatio") as string) || null;
    
    const author = (formData.get("author") as string) || "Admin";
    const version = (formData.get("version") as string) || "1.0";

    const isFeatured = formData.get("isFeatured") === "true";
    const isTrending = formData.get("isTrending") === "true";

    // Parse tags and colorPalette arrays from comma-separated strings
    const tagsStr = (formData.get("tags") as string) || "";
    const tags = tagsStr.split(",").map(t => t.trim()).filter(Boolean);

    const colorsStr = (formData.get("colorPalette") as string) || "";
    const colorPalette = colorsStr.split(",").map(c => c.trim()).filter(Boolean);

    // 3. Handle Image Upload to Cloudinary
    const imageFile = formData.get("previewImageFile") as File;
    let previewImage = formData.get("previewImageUrl") as string;

    if (imageFile && imageFile.size > 0) {
      console.log(`Streaming file to Cloudinary: ${imageFile.name} (${imageFile.size} bytes)`);
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const cloudinaryRes: any = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "promptverse",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      if (!cloudinaryRes?.secure_url) {
        return { success: false, error: "Failed to upload image to Cloudinary." };
      }
      previewImage = cloudinaryRes.secure_url;
    }

    if (!previewImage) {
      return { success: false, error: "Preview image is required." };
    }

    // 4. Create database entry
    const slug = generateSlug(title);
    const newPrompt = await db.prompt.create({
      data: {
        slug,
        title,
        description,
        prompt: promptText,
        negativePrompt,
        previewImage,
        category,
        subCategory,
        model,
        difficulty: difficultyVal,
        quality: qualityVal,
        tags,
        isFeatured,
        isTrending,
        estimatedTime,
        style,
        camera,
        lighting,
        aspectRatio,
        colorPalette,
        author,
        version,
      }
    });

    // 5. Revalidate routes
    revalidatePath("/");
    revalidatePath("/prompts");
    revalidatePath(`/prompts/${newPrompt.id}`);
    revalidatePath(`/category/${category}`);
    revalidatePath(`/models/${model}`);

    return { success: true, prompt: newPrompt };
  } catch (error: any) {
    console.error("Error creating prompt:", error);
    return { success: false, error: error.message || "Failed to create prompt." };
  }
}
