import { useI18n } from 'next-localization';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

import Title from '../components/title';

const Dashboard = () => {
    const router = useRouter();
    const i18n = useI18n();

    useEffect(() => {
        async function changeLocale() {
            if (router.locale === 'en') {
            if (['en', 'de'].includes(router.locale)) {
                i18n.set(router.locale, await import(`../../public/locales/${router.locale}/common.json`));
                i18n.locale(router.locale);
            }
            }
        }
        changeLocale();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router.locale]);

    return (
        <div>
            <Title username="Peter" />
            <h2>{i18n.t('intro.text')}</h2>
            <h3>{i18n.t('dashboard.description')}</h3>
            <div>Current locale: {router.locale}</div>
            <div>
                <Link href="/dashboard" locale="en">
                    Change language to (en)
                </Link>
            </div>
            <div>
                <Link href="/dashboard" locale="de">
                    Change language to (de)
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
