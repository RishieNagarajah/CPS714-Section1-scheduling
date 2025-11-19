
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div style={{ marginTop: '70px' }}>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
