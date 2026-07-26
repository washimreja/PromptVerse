const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Supabase database with prompts in batch...');
  
  const promptsFilePath = path.join(__dirname, '../data/prompts.json');
  const promptsData = JSON.parse(fs.readFileSync(promptsFilePath, 'utf8'));

  // Clear existing prompts to avoid duplicates
  console.log('Clearing existing prompts...');
  await prisma.prompt.deleteMany();

  const dataList = promptsData.map((prompt) => ({
    id: prompt.id,
    slug: prompt.slug,
    title: prompt.title,
    description: prompt.description,
    prompt: prompt.prompt,
    negativePrompt: prompt.negativePrompt || null,
    previewImage: prompt.previewImage,
    category: prompt.category,
    subCategory: prompt.subCategory || null,
    model: prompt.model,
    difficulty: prompt.difficulty,
    quality: prompt.quality,
    createdAt: new Date(prompt.createdAt),
    updatedAt: new Date(prompt.updatedAt),
    tags: prompt.tags || [],
    isFeatured: prompt.isFeatured ?? false,
    isTrending: prompt.isTrending ?? false,
    copyCount: prompt.copyCount ?? 0,
    estimatedTime: prompt.estimatedTime || null,
    style: prompt.style || null,
    camera: prompt.camera || null,
    lighting: prompt.lighting || null,
    aspectRatio: prompt.aspectRatio || null,
    colorPalette: prompt.colorPalette || [],
    author: prompt.author || "Admin",
    version: prompt.version || "1.0",
  }));

  console.log(`Inserting ${dataList.length} prompts...`);
  const result = await prisma.prompt.createMany({
    data: dataList,
  });

  console.log(`Successfully seeded ${result.count} prompts in Supabase!`);
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
