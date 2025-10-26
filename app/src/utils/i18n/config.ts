/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// Next Libraries
import { getRequestConfig } from 'next-intl/server'
// Project Libraries
import { getCurrentLocale } from './locale'
import { loadMessages } from './messages'


/////////////////////////////
///    CONFIGS SECTION    ///
/////////////////////////////
export default getRequestConfig(async () => {
    const locale = await getCurrentLocale()

    return {
        locale,
        messages: await loadMessages(locale),
    }
})
