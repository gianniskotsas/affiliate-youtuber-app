import { getUserById } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";
import ProfilePageClient from "@/components/dashboard/ProfilePageClient";

export default async function ProfilePage() {
  const { userId } = await auth();

  const userDb = userId ? await getUserById(userId) : null;

  if (!userDb) {
    return <div>User not found</div>;
  }

  return <ProfilePageClient userData={userDb} />;
}
