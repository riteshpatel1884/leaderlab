import "./globals.css";

export const metadata = {
  title: "Statuscode  ",
  description: "Track your job applications, interviews, and offers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
