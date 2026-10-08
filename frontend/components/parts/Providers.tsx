"use client";

import AuthProvider from "@/context/AuthContext";
import JobContextProvider from "@/context/JobContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <JobContextProvider>{children}</JobContextProvider>
    </AuthProvider>
  );
}
