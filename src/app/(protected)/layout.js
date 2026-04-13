import Sidebar from "@/Components/Sidebar";
import BottomNav from "@/Components/BottomNav";

export default function ProtectedLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
      <BottomNav />
    </div>
  );
}
