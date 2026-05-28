import type {Metadata} from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css'; // Global styles

export const metadata: Metadata = {
  title: 'Verdana — Digital Oasis',
  description: 'Where technology meets the earth. A sanctuary for sustainable minds building a regenerative future.',
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
