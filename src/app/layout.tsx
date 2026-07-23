import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/layout/top-nav";
import { Sidebar } from "@/components/layout/sidebar";
import { RightSidebar } from "@/components/layout/right-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/ui/command-palette";
import { OnboardingModal } from "@/components/modals/onboarding-modal";

export const metadata: Metadata = {
  title: "FutureTech — The Developer Platform",
  description: "Research-grounded platform for technical reading, Q&A, podcasts, careers, and mentorship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] pb-16 md:pb-0">
          <TopNav />
          <div className="flex-1 flex w-full justify-between items-stretch">
            <Sidebar />
            <main className="flex-1 min-w-0 p-4 md:p-6 flex flex-col items-center">
              <div className="w-full max-w-[820px]">{children}</div>
            </main>
            <RightSidebar />
          </div>
          <MobileNav />
          <CommandPalette />
          <OnboardingModal />
        </div>
      </body>
    </html>
  );
}
