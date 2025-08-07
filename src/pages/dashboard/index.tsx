'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-semibold text-foreground mb-4">
        Dashboard Home
      </h1>
      <ul className="space-y-2">
        <li>
          <Link href="/dashboard/alert-management-dashboard" className="text-primary hover:underline">
            Alert Management
          </Link>
        </li>
        <li>
          <Link href="/dashboard/profile-management-dashboard" className="text-primary hover:underline">
            Profile Management
          </Link>
        </li>
        <li>
          <Link href="/dashboard/settings-dashboard" className="text-primary hover:underline">
            Settings
          </Link>
        </li>
        <li>
          <Link href="/dashboard/what-if-scenario-simulator-dashboard" className="text-primary hover:underline">
            What-If Scenario Simulator
          </Link>
        </li>
        {/* Thêm các link khác tương tự */}
      </ul>
    </div>
  );
}
