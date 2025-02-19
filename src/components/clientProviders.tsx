"use client";

import { UserProvider } from "@/Context/UserContext";
import { SessionProvider } from "next-auth/react";

export default function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <SessionProvider>
      {children}
      </SessionProvider>
    </UserProvider>
  );
}