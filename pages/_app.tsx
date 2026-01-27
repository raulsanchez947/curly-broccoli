import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DevDialogTitleInjector from '../components/DevDialogTitleInjector'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }: AppProps) {
  // pageProps may include a `session` populated by NextAuth on the server
  const { session, ...rest } = pageProps as any

  return (
    <SessionProvider session={session}>
      <DevDialogTitleInjector />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto p-4">
          <Component {...rest} />
        </main>
        <Footer />
      </div>
    </SessionProvider>
  )
}
