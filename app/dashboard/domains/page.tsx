import { cookies } from "next/headers";
import { getUserById } from "@/db/queries";
import DomainClient from "@/components/dashboard/DomainClient";
import { auth } from "@clerk/nextjs/server";


export default async function DomainsPage() {
    const { userId } = await auth()

    const userDb = userId ? await getUserById(userId) : null;

  if (!userDb) {
    return <div>User not found</div>;
  }

  return <DomainClient userDb={userDb} />;
}
