/////////////////////////////
///    IMPORTS SECTION    ///
/////////////////////////////
// React Libraries
import React from "react"
// Next Libraries
import { redirect } from 'next/navigation'
// Project Libraries
import { verifySession } from '@/src/controller/session-controller'
import StudentHeader from '@/components/navigation/StudentHeader'
import OrganizationHeader from '@/components/navigation/OrganizationHeader'
import CoordinatorHeader from '@/components/navigation/CoordinatorHeader'
import AdminHeader from '@/components/navigation/AdminHeader'
import Footer from "@/components/navigation/Footer";


/////////////////////////////
///   LAYOUT COMPONENT    ///
/////////////////////////////
export default async function DashboardLayout({children}: { children: React.ReactNode }) {
  // Use existing session controller
  const user = await verifySession()
  if (!user) {
    redirect(`/login`)
  }

  // Render role-specific header
  const renderHeader = () => {
    switch (user.role) {
      case 'STUDENT':
        return <StudentHeader user={user} />
      case 'ORGANIZATION':
        return <OrganizationHeader user={user} />
      case 'COORDINATOR':
        return <CoordinatorHeader user={user} />
      case 'ADMINISTRATOR':
        return <AdminHeader user={user} />
      default:
        return null
    }
  }

  return (
      <div className="min-h-screen bg-background">
        {/* Header Navigation */}
        {renderHeader()}

        {/* Main Content */}
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>

        <Footer />
      </div>
  )
}
