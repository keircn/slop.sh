import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "~/components/Navbar";
import { NavbarProvider } from "~/context/NavbarContext";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  return {
    metadataBase: new URL("https://slop.sh"),
    title: "Keiran",
    description: "I make things",
    icons: {
      icon: [
        {
          url: "/favicon/favicon-16x16.png",
          sizes: "16x16",
          type: "image/png",
        },
        {
          url: "/favicon/favicon-32x32.png",
          sizes: "32x32",
          type: "image/png",
        },
        { url: "/favicon/favicon.ico", sizes: "any" },
      ],
      apple: [
        {
          url: "/favicon/apple-touch-icon.png",
          sizes: "180x180",
          type: "image/png",
        },
      ],
      other: [
        {
          rel: "android-chrome",
          url: "/favicon/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          rel: "android-chrome",
          url: "/favicon/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
        { rel: "manifest", url: "/favicon/site.webmanifest" },
      ],
    },
    openGraph: {
      title: "Keiran",
      description: "i make things",
      url: "https://slop.sh",
      siteName: "slop.sh",
      images: [
        {
          url: "/og-image.png",
          width: 800,
          height: 400,
          alt: "brrr",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark scroll-smooth">
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col isolate overflow-x-hidden`}
      >
        <NavbarProvider>
          <div className="relative flex-grow flex flex-col z-0">
            <Navbar />
            {children}
          </div>
        </NavbarProvider>
      </body>
    </html>
  );
}
