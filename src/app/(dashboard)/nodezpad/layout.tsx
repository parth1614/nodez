import React from "react";

export default function NodezpadLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
      <div className=" flex flex-col h-full overflow-y-auto col-span-4 py-2 px-6 rounded-[2rem] bg-card-foreground/5">
        {children}
      </div>
  );
}
