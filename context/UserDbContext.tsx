'use client'
import { createContext, useContext, useEffect, useState } from "react";
import { SelectUser } from "@/db/schema"; // Import the Drizzle inferred type
import { getUserById } from "@/db/queries";
import { auth } from "@clerk/nextjs/server";

const UserDbContext = createContext<{ userDb: SelectUser | null; }>({
  userDb: null,
});

export const UserDbProvider = async ({ children }: { children: React.ReactNode }) => {
  


  return (
    <UserDbContext.Provider value={{ userDb: null}}>
      {children}
    </UserDbContext.Provider>
  );
};

export const useUserDb = () => useContext(UserDbContext);
