import { useI18n } from 'next-localization';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Title from '@/components/title';

const PostPage = () => {
    const router = useRouter();
    const i18n = useI18n();
    const tp = i18n.withPlural();

    return (
        <div>
            <Title username="Peter" />
            <h2>{i18n.t('intro.text')}</h2>
            <h3>{i18n.t('intro.description')}</h3>
            <div>Current locale: {router.locale}</div>
            <div>Pluralization: {tp('warning', { birds: 2 })}</div>
            <div>
                <Link href="/foo" locale="en">
                    Change language to (en)
                </Link>
            </div>
            <div>
                <Link href="/foo" locale="de">
                    Change language to (de)
                </Link>
            </div>
        </div>
    );
};

export async function getStaticProps({ locale }) {
    const { default: lngDict = {} } = await import(`../../../public/locales/${locale}/common.json`);

    return {
        props: { lngDict }
    };
}

export async function getStaticPaths({ locales }) {
    return {
        paths: locales.map((l) => ({ params: { slug: `foo` }, locale: l })),
        fallback: false
    };
}

export default PostPage;
