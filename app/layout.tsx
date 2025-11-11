import './globals.css'
import React from 'react'
import ReduxProvider from '@/providers/ReduxProvider'
import ThemeRegistry from '@/providers/ThemeRegistry'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>Dynamic Data Table Manager</title>
        <meta
          name="description"
          content="Built with Next.js, Redux Toolkit, and MUI"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        <ReduxProvider>
          <ThemeRegistry>{children}</ThemeRegistry>
        </ReduxProvider>

        <footer style={{ textAlign: 'center', marginTop: '2rem', padding: '1rem', fontSize: '0.9rem', color: '#666' }}>
  © {new Date().getFullYear()} Adnan Irfan Kazi — Built with ❤️ using Next.js + Redux + MUI.
  <br />
  <a href="https://github.com/your-username/dynamic-data-table-manager" target="_blank" rel="noopener noreferrer" style={{ color: '#1976d2', textDecoration: 'none' }}>
    View Source on GitHub
  </a>
</footer>

      </body>
    </html>
  )
}
