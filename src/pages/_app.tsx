import { AppProps } from 'next/app';
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'next-themes';
import Head from 'next/head';

interface AppPageProps {
    lngDict: Record<string, unknown>;
    [key: string]: unknown;
}

export default function MyApp({ Component, pageProps }: AppProps<AppPageProps>) {
    const router = useRouter();
    const { lngDict, ...rest } = pageProps;

    return (
        <ThemeProvider attribute="class">
            <I18nProvider lngDict={lngDict} locale={router.locale || 'en'}>
                <Head>
                    <meta
                        name='viewport'
                        content='width=device-width, initial-scale=1, user-scalable=0, viewport-fit=cover'
                    />
                </Head>
                <Component {...rest} />
            </I18nProvider>
        </ThemeProvider>
    );
}
