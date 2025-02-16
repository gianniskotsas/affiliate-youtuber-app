import { UserDbProvider } from "@/context/UserDbContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <UserDbProvider>{children}</UserDbProvider>;
}
