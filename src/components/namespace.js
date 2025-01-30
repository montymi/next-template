import { I18nProvider, useI18n } from 'next-localization';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export default function Namespace() {
    const router = useRouter();
    const translations = useMemo(async () => {
        const nsModule = await import(`../../public/locales/${router.locale}/namespace.json`);
        return nsModule.default || {};
    }, [router.locale]);

    return (
        <I18nProvider lngDict={translations} locale={router.locale}>
            <Title />
        </I18nProvider>
    );
}

export function Title() {
    const i18n = useI18n();
    return <h1>{i18n.t('title')}</h1>;
}
