import { Html, Head, Main, NextScript, DocumentContext } from 'next/document'
import Document from 'next/document'

class MyDocument extends Document {
    static async getInitialProps(ctx: DocumentContext) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }

    render() {
        return (
            <Html lang='en'>
                <Head>
                    <meta charSet='utf-8' />
                    <link rel='icon' type='image/png' href='/images/favicon.png' />
                    <meta
                        name='theme-color'
                        content='#18181b'
                        media='(prefers-color-scheme: dark)'
                    />
                    <meta name='theme-color' content='#f4f4f5' />
                    <link rel='apple-touch-icon' href='/images/icon-maskable-512.png' />
                    <link rel='manifest' href='/manifest.json' />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument