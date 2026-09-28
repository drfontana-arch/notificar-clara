import './globals.css'
import { Montserrat, Inter, Roboto_Mono } from 'next/font/google'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-montserrat',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-roboto-mono',
  display: 'swap',
})

export const metadata = {
  title: 'NotificAR Clara',
  description: 'Entendé tu notificación judicial en lenguaje claro — Red Marea D+I',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable} ${inter.variable} ${robotoMono.variable}`}>
      <body>{children}</body>
    </html>
  )
}
