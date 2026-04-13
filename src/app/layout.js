import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationsProvider } from "./context/ApplicationsContext";

export const metadata = { title: "LeaderLab" };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ApplicationsProvider>{children}</ApplicationsProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
