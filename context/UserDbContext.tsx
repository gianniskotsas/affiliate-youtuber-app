"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { SelectUser } from "@/db/schema"; // Import the Drizzle inferred type

const UserDbContext = createContext<{ userDb: SelectUser | null; loading: boolean }>({
  userDb: null,
  loading: true,
});

export const UserDbProvider = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const [userDb, setUserDb] = useState<SelectUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetch(`/api/user/check-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          setUserDb(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [userId]);

  return (
    <UserDbContext.Provider value={{ userDb, loading }}>
      {children}
    </UserDbContext.Provider>
  );
};

export const useUserDb = () => useContext(UserDbContext);
