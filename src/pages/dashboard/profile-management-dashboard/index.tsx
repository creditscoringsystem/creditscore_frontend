// app/(dashboard)/profile/page.tsx  ── hoặc ── pages/profile/index.tsx
'use client';

import React, { useEffect, useState } from 'react';

import Sidebar from '@/components/ui/Sidebar';
import Header from '@/components/ui/Header';
import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';
import AccountLinking from './components/AccountLinking';
import ProfilePreview from './components/ProfilePreview';

/* -------------------------------------------------- */
/*                    Component                       */
/* -------------------------------------------------- */

const ProfileManagementDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* ------ fake-loading (demo) ------ */
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1_000);
    return () => clearTimeout(timer);
  }, []);

  /* ---------- skeleton while loading ---------- */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex">
        <Sidebar />
        <div className="flex-1 ml-80">
          <Header />
          <main className="pt-20 px-6 py-8 space-y-6">
            <div className="h-24 w-full rounded-lg bg-muted animate-pulse" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-80 rounded-lg bg-muted animate-pulse" />
                <div className="h-96 rounded-lg bg-muted animate-pulse" />
                <div className="h-64 rounded-lg bg-muted animate-pulse" />
              </div>
              <div className="h-[600px] rounded-lg bg-muted animate-pulse" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  /* -------------------- main UI -------------------- */
  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 ml-80">
        <Header />

        <main className="pt-20 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {/* page heading */}
            <header className="mb-8">
              <h1 className="text-3xl font-semibold text-foreground mb-2">
                Profile Management
              </h1>
              <p className="text-muted-foreground">
                Manage your personal information and account preferences
              </p>
            </header>

            {/* two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* left: editable forms */}
              <section className="lg:col-span-2 space-y-6">
                <ProfileHeader />
                <PersonalInfoForm />
                <AccountLinking />
              </section>

              {/* right: sticky preview */}
              <aside className="lg:col-span-1">
                <ProfilePreview />
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileManagementDashboard;
