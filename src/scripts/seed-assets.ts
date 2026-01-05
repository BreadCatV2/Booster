
import { db } from "@/db";
import { assets } from "@/db/schema";
import { v4 as uuidv4 } from "uuid";

const main = async () => {
  console.log("Seeding assets...");

  const newAssets = [
    {
      name: "Creator Badge",
      description: "A badge for creators",
      category: "icons",
      price: 500,
      iconNumber: 1,
    },
    {
      name: "Community Badge",
      description: "A badge for community members",
      category: "icons",
      price: 500,
      iconNumber: 2,
    },
    {
      name: "Star Badge",
      description: "A shiny star badge",
      category: "icons",
      price: 500,
      iconNumber: 3,
    },
  ];

  for (const asset of newAssets) {
    await db.insert(assets).values({
      assetId: uuidv4(),
      ...asset,
      updatedAt: new Date(),
    });
  }

  console.log("Assets seeded successfully!");
  process.exit(0);
};

main().catch((err) => {
  console.error("Error seeding assets:", err);
  process.exit(1);
});
