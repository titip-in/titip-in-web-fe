import { Topbar } from "./Topbar";
import { Sidebar } from "./Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="app-shell grid min-h-screen" style={{ gridTemplateColumns: "var(--sidebar-w) 1fr", gridTemplateRows: "var(--topbar-h) 1fr" }}>
      <Topbar />
      <Sidebar />
      <main className="main-content overflow-y-auto bg-cream p-8 px-12 pb-16">
        <div className="mx-auto w-full max-w-[1400px]">
          {children}
        </div>
      </main>
    </div>
  );
}
