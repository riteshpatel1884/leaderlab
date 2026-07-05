import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ApplicationsProvider } from "./context/ApplicationsContext";
import { ThemeProvider } from "../utils/themeProvider/Themeprovider"; // adjust path as needed
import { Analytics } from "@vercel/analytics/next"

export const metadata = { title: "LeaderLab" };

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en" data-theme="dark" suppressHydrationWarning>
        <body>
          <ThemeProvider>
            <ApplicationsProvider>{children}</ApplicationsProvider>
          </ThemeProvider>
           <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}