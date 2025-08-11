// src/pages/dashboard/profile-management-dashboard/index.tsx
'use client';

import React, { useEffect, useState } from 'react';
import DashboardShell from '@/components/layouts/DashboardShell';

import ProfileHeader from './components/ProfileHeader';
import PersonalInfoForm from './components/PersonalInfoForm';

const ProfileManagementDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Giữ fake-loading để UX mượt trong lúc chưa nối backend
    const t = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(t);

    /**
     * ===== HƯỚNG DẪN KẾT NỐI BACKEND (chỉ riêng file index này) =====
     *
     * 1) Tạo src/lib/profileApi.ts:
     *    -------------------------------------------------------------
     *    export async function getProfile() {
     *      const r = await fetch('/api/profile', { cache: 'no-store' });
     *      if (!r.ok) throw new Error('Failed to load profile');
     *      return r.json();
     *    }
     *
     *    export async function updateProfile(payload: any) {
     *      const r = await fetch('/api/profile', {
     *        method: 'PATCH',
     *        headers: { 'Content-Type': 'application/json' },
     *        body: JSON.stringify(payload),
     *      });
     *      if (!r.ok) throw new Error('Failed to update profile');
     *      return r.json();
     *    }
     *
     *    export async function uploadAvatar(formData: FormData) {
     *      const r = await fetch('/api/profile/photo', {
     *        method: 'POST',
     *        body: formData,
     *      });
     *      if (!r.ok) throw new Error('Failed to upload avatar');
     *      return r.json();
     *    }
     *    -------------------------------------------------------------
     *
     * 2) Khi cần load dữ liệu ở đây:
     *    const data = await getProfile(); setProfile(data);
     *
     * 3) Khi component con mở props, truyền xuống như sau:
     *    <ProfileHeader
     *      profile={profile}
     *      onUploadPhoto={async (fileOrPreset) => { ...await uploadAvatar(fd); await reload(); }}
     *    />
     *    <PersonalInfoForm
     *      initialValues={profile}
     *      onSave={async (values) => { await updateProfile(values); await reload(); }}
     *    />
     *
     * 4) Tạo hàm reload() gọi lại getProfile() để refresh UI sau khi save/upload.
     */
  }, []);

  // Container đặt giữa, nhưng “dịch trái” nhẹ để canh thị giác
  const CONTAINER = 'mx-auto max-w-[1200px] px-6';
  // NUDGE: dịch trái ~200–260px trên desktop, ít hơn ở tablet; không đụng mobile
  const NUDGE_LEFT =
    'md:transform md:-translate-x-[120px] lg:-translate-x-[160px] xl:-translate-x-[220px] 2xl:-translate-x-[130px]';

  if (isLoading) {
    return (
      <DashboardShell>
        <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
          {/* Skeleton heading */}
          <div className="h-10 w-64 rounded-lg bg-muted animate-pulse mb-6" />
          {/* Skeleton cho 2 block chính (trên/dưới) */}
          <div className="space-y-6">
            <div className="h-40 rounded-lg bg-muted animate-pulse" />
            <div className="h-[720px] rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className={`${CONTAINER} ${NUDGE_LEFT}`}>
        {/* Page heading */}
        <header className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">Profile Management</h1>
          <p className="text-muted-foreground">
            Manage your personal information and account preferences
          </p>
        </header>

        {/* Chỉ giữ 2 components, kéo dài full-width theo container */}
        <section className="space-y-6">
          <div className="min-w-0">
            <ProfileHeader />
          </div>
          <div className="min-w-0">
            <PersonalInfoForm />
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default ProfileManagementDashboard;
