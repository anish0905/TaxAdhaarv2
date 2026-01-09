import AuthProvider from "@/components/AuthProvider";
import "./globals.css";
import PublicNavbar from "@/components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <PublicNavbar/>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}