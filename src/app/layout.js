import "./globals.css";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import Sidebar from "./Components/Sidebar";
import BottomNav from "./Components/BottomNav";

export const metadata = { title: "Statuscode" };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ApplicationsProvider>
          <div className="app-layout">
            <Sidebar />
            <main className="main-content">{children}</main>
          </div>
          <BottomNav />
        </ApplicationsProvider>
      </body>
    </html>
  );
}
