// layout.tsx
"use client"; // Ensure this is a client component

import { supabase } from "@/lib/supabaseClient"; // Adjust the import based on your setup
import { useRouter, usePathname } from "next/navigation"; // Import the router hook
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  // useEffect(() => {
  //   const checkUser = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (!user && pathname !== "/reset-password") {
  //       router.push("/sign-in");
  //     }
  //   };

  //   checkUser();
  // }, [router]);

  return (
    <div className="max-w-7xl flex flex-col gap-12 items-start">{children}</div>
  );
}
