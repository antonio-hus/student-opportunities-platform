/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React from "react"
// Next Libraries
import type { Metadata } from "next"
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
// Styles
import "./globals.css"

/////////////////////////////
///   METADATA  SECTION   ///
/////////////////////////////
// Generate dynamic metadata with translations
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations('metadata')
  return {
    title: t('title'),
    description: t('description'),
  }
}

/////////////////////////////
///    LAYOUT  SECTION    ///
/////////////////////////////
export default async function RootLayout({children}: { children: React.ReactNode }) {
  // Load translation messages
  const messages = await getMessages()

  return (
      <html lang="en" className="bg-background text-foreground">
        <body className="antialiased">
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
  )
}
