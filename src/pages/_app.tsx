import type { AppProps } from 'next/app'
import { ThemeProvider } from 'next-themes'
import '@/styles/globals.css'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
    return (
        <ThemeProvider
            attribute='class'
            defaultTheme='system'
            disableTransitionOnChange
        >
            <Head>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
                />
            </Head>
            <Component {...pageProps} />
        </ThemeProvider>
    )
}