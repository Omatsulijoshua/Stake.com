import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ChatSidebar from "@/components/ChatSidebar";
import LiveStatsTicker from "@/components/LiveStatsTicker";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Stake Clone | Premium Crypto Casino",
  description: "Experience the best crypto casino platform with Dice, Crash, and Roulette.",
};

import { Providers } from "@/components/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#0f212e]`}>
        <Providers>
          <Toaster theme="dark" position="bottom-left" richColors />
          <Topbar />
          <div className="flex pt-16 pb-10">
            <Sidebar />
            <main className="flex-1 ml-64 min-h-[calc(100vh-104px)]">
              {children}
            </main>
            <ChatSidebar />
            <LiveStatsTicker />
          </div>
        </Providers>
      </body>
    </html>
  );
}
