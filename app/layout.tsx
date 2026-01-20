// app/layout.tsx
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import { Navbar } from '@/components/navbar';
import TanstackProvider from '@/components/query-client-provider';
import Footer from '@/components/footer';
import AppSessionProvider from '@/components/session-provider';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TalentTank AI',
  description: 'AI-Powered Contests Tailored to Your Expertise',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AppSessionProvider>
          {/* Move auth check to Navbar/AdminNav components */}
          <Navbar />
          <main className="px-4">
            <TanstackProvider>{children}</TanstackProvider>
            <Footer />
          </main>
          <Toaster />
        </AppSessionProvider>
      </body>
    </html>
  );
}
