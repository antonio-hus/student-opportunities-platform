import createNextIntlPlugin from 'next-intl/plugin';
import {NextConfig} from "next";

const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

const nextConfig: NextConfig = {

};

export default withNextIntl(nextConfig);


