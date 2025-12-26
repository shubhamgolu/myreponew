import "@/css/satoshi.css";
import "@/css/style.css";
import AuthGate from "@/components/Auth/AuthGate";  
import { Sidebar } from "@/components/Layouts/sidebar";

import "flatpickr/dist/flatpickr.min.css";
import "jsvectormap/dist/jsvectormap.css";

import { Header } from "@/components/Layouts/header";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import type { PropsWithChildren } from "react";
import { Providers } from "./providers";
import ClientLayout from "./client-layout";
export const metadata: Metadata = {
  title: {
    template: "%s | NextAdmin - Next.js Dashboard Kit",
    default: "NextAdmin - Next.js Dashboard Kit",
  },
  description:
    "Next.js admin dashboard toolkit with 200+ templates, UI components, and integrations for fast dashboard development.",
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
      <html lang="en" suppressHydrationWarning>
      <body>
        
        <Providers>
          <ClientLayout>{children}</ClientLayout>
        </Providers>
      
      </body>
    </html>
  );
}
