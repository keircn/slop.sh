import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keiran",
  description: "I make things",
  icons: {
    icon: "/vercel.svg",
  },
  openGraph: {
    title: "Keiran",
    description: "I make things",
    url: "https://slop.sh",
    siteName: "slop.sh",
    /* images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ], */
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                document.documentElement.classList.toggle('dark', prefersDark);

                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                  document.documentElement.classList.toggle('dark', e.matches);
                });
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}
      >
        <div className="flex-grow flex flex-col">{children}</div>
      </body>
    </html>
  );
}
