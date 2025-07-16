import './globals.css';
import localFont from 'next/font/local';

const sligoil = localFont({
  src: [
    {
      path: './fonts/Sligoil-Micro.woff2',
      weight: '100',
    },
    {
      path: './fonts/Sligoil-MicroMedium.woff2',
      weight: '500',
    },
    {
      path: './fonts/Sligoil-MicroBold.woff2',
      weight: '900',
    },
  ],
  variable: '--font-sligoil',
});

export const metadata = {
  title: 'pEEp',
  description: 'a sound visualizer',
  appleWebApp: {
    title: 'pEEp',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${sligoil.variable} antialiased`}>{children}</body>
    </html>
  );
}
