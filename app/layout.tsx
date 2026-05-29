import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Grass Harmony',
  description: 'Relaxing music and swaying grass in a peaceful atmosphere.',
};

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['300', '400', '500', '600']
});

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600'],
  style: ['normal', 'italic']
});

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body suppressHydrationWarning className="font-sans">
        {children}
      </body>
    </html>
  );
}
