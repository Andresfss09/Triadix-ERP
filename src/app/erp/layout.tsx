import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { SmartCounter } from "@/components/erp/SmartCounter";

export default function ERPLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-background text-foreground overflow-hidden font-sans transition-colors duration-300">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
      <SmartCounter />
    </div>
  );
}
