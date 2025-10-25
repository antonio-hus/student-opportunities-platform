/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import {NextConfig} from "next";
import createNextIntlPlugin from 'next-intl/plugin';

/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
// Application Configs
const nextConfig: NextConfig = {};

// Internationalization Configs
const withNextIntl = createNextIntlPlugin('./i18n/config.ts');
export default withNextIntl(nextConfig);


