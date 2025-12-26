"use client";

import { usePathname, useRouter } from "next/navigation";
import NextTopLoader from "nextjs-toploader";
import { Sidebar } from "@/components/Layouts/sidebar";
import { Header } from "@/components/Layouts/header";
import { getUser } from "@/utils/auth";
import { useEffect, useState } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // login route
  const isLoginPage = pathname === "/";

  // 🔥 AUTH GATE
  // const [authorized, setAuthorized] = useState(false);

  // useEffect(() => {
  //   if (isLoginPage) {
  //     setAuthorized(true);
  //     return;
  //   }

  //   const user = getUser();

  //   if (!user) {
  //     router.replace("/"); // login
  //     return;
  //   }

  //   setAuthorized(true);
  // }, [isLoginPage, router]);

  // // 🚫 NOTHING renders until auth resolved
  // if (!authorized) return null;

  return (
    <>
      <NextTopLoader color="#5750F1" showSpinner={false} />

      <div className="flex min-h-screen">
        {!isLoginPage && <Sidebar />}

        <div className="w-full bg-gray-2 dark:bg-[#020d1a]">
          {!isLoginPage && <Header />}

          <main
            className={`mx-auto w-full ${
              isLoginPage
                ? "min-h-screen p-0"
                : "max-w-screen-2xl p-4 md:p-6 2xl:p-10"
            }`}
          >
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
