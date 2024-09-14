import '../styles/globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from "@/components/ui/theme-provider"
import { AuthProvider } from './auth/AuthContext'

// Initialize the Inter font
const inter = Inter({ subsets: ['latin'] })

// Define metadata for the application
export const metadata: Metadata = {
  title: 'Enhanced Todo List App',
  description: 'A modern, clean, and minimalistic todo list application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="system" 
          enableSystem 
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="min-h-screen bg-background text-foreground">
              {children}
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}