import "./globals.css";
import Navbar from "./components/navbar";
import { AccountProvider } from "./contexts/AccountContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AccountProvider>
          <Navbar/>
            {children}
        </AccountProvider>
      </body>
    </html>
  );
}
