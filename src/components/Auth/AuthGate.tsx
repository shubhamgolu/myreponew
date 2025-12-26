// components/AuthGate.tsx
"use client";

import { getUser } from "@/utils/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AuthGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const user = getUser();

    if (!user) {
      router.replace("/login"); // or "/"
      return;
    }

    setAllowed(true);
  }, [router]);

  // 🚫 NOTHING renders until auth is known
  if (!allowed) return null;

  return <>{children}</>;
}
