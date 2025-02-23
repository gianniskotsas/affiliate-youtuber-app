import { Toaster } from "@/components/ui/toaster";
import { UserDbProvider } from "@/context/UserDbContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <UserDbProvider>
      {children}
      <Toaster />
    </UserDbProvider>
  );
}
