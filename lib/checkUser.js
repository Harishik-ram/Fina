import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";

export const checkUser = async () => {
  console.log("✅ checkUser called");

  const user = await currentUser();
  console.log("👤 Clerk user:", user?.id);

  if (!user) return null;

  try {
    const loggedInUser = await db.user.findUnique({
      where: { clerkUserId: user.id },
    });

    if (loggedInUser) {
      console.log("🟢 User already exists in DB");
      return loggedInUser;
    }

    console.log("🆕 Creating new user...");

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name: `${user.firstName} ${user.lastName}`,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0].emailAddress,
      },
    });

    console.log("✅ User created:", newUser.id);
    return newUser;
  } catch (error) {
    console.error("❌ DB ERROR:", error);
  }
};
