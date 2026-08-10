import './globals.css'

export const metadata = {
  title: 'NotificAR Clara',
  description: 'Entendé tu notificación judicial en lenguaje claro',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
