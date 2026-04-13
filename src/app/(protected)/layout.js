import Sidebar from "../Components/Sidebar.js";
import BottomNav from "../Components/BottomNav.js";

export default function ProtectedLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
      <BottomNav />
    </div>
  );
}
