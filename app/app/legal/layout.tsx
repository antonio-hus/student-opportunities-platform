/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React from 'react'
// Project Libraries
import Footer from '@/components/navigation/Footer'


/////////////////////////////
///   LAYOUT COMPONENT    ///
/////////////////////////////
export default function LegalLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="min-h-screen bg-background">
                <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
                    {children}
                </div>
            </div>
            <Footer />
        </>
    )
}
