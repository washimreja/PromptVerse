import { getCollectionDetailsAction } from "@/app/actions/user";
import { CollectionDetailClient } from "@/components/collections/CollectionDetailClient";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const collection = await getCollectionDetailsAction(id);

  if (!collection) {
    return {
      title: "Collection Not Found | PromptVerse",
    };
  }

  return {
    title: `${collection.icon} ${collection.name} | PromptVerse Collections`,
    description: `Manage and view saved AI prompts in collection "${collection.name}".`,
  };
}

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const collectionData = await getCollectionDetailsAction(id);

  return (
    <CollectionDetailClient
      initialData={collectionData}
      collectionId={id}
    />
  );
}
