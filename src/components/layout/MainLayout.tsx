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
      <main className="main-content overflow-y-auto bg-cream p-8 px-10 pb-16">
        <div className="content-max max-w-[1200px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
