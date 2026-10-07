import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/store/store';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const metadata: Metadata = {
  title: 'PulseHub | Personalized Content Dashboard',
  description:
    'An interactive, user-centric dashboard aggregating real-time news, movie recommendations, and social media trends with customizable preferences.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="antialiased">
        <StoreProvider>
          <div className="flex min-h-screen bg-slate-50 dark:bg-zinc-950">
            <Sidebar />
            <div className="flex flex-1 flex-col min-w-0">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
                {children}
              </main>
            </div>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
