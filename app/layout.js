import Link from 'next/link';
import localFont from "next/font/local";
import "./globals.css";
import EditorStyles from './components/EditorStyles'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans antialiased min-h-screen bg-gray-100"> 
        <EditorStyles />
        <nav className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex">
                <Link href="/templates/index">
                  <span className="flex-shrink-0 flex items-center text-gray-900">Document Templates</span>
                </Link>
                <Link href="/templates/new">
                  <span className="ml-6 inline-flex items-center px-1 border-transparent text-sm font-medium text-gray-500 hover:text-indigo-700">
                    New Document Template
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </body>
    </html>
  );
}
