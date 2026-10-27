import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { MainLayout } from '@/components/layout/MainLayout';

export const metadata: Metadata = {
  title: 'NekoStream — Modern Neumorphism Anime Streaming',
  description: 'NekoStream is a modern, sleek anime streaming platform featuring elegant neumorphism design.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neu-bg text-neu-text selection:bg-neu-accent selection:text-white">
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
