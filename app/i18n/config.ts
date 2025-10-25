import {getRequestConfig} from 'next-intl/server';
import {cookies} from 'next/headers';

export const locales = ['en', 'ro'] as const;
export const defaultLocale = 'en' as const;

export default getRequestConfig(async () => {
    const cookieStore = await cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || defaultLocale;

    return {
        locale,
        messages: (await import(`../messages/${locale}`)).default
    };
});
