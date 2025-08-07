// app/(dashboard)/profile/components/ProfilePreview.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

/* ---------- Kiểu dữ liệu ---------- */
interface Activity {
  action: string;
  time: string;
  icon: string;
  color: string; // class Tailwind
}

interface UserPreview {
  name: string;
  email: string;
  phone: string;
  memberSince: string;
  creditScore: number;
  accountType: string;
  completionPercentage: number;
  recentActivity: Activity[];
}

const ProfilePreview: React.FC = () => {
  const mockUserData: UserPreview = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    memberSince: 'January 2023',
    creditScore: 742,
    accountType: 'Premium',
    completionPercentage: 78,
    recentActivity: [
      {
        action: 'Credit score updated',
        time: '2 hours ago',
        icon: 'TrendingUp',
        color: 'text-success'
      },
      {
        action: 'Profile information changed',
        time: '2 weeks ago',
        icon: 'Edit',
        color: 'text-primary'
      },
      {
        action: 'Password updated',
        time: '1 month ago',
        icon: 'Lock',
        color: 'text-warning'
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* -------- Profile Summary -------- */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 neon-border-glow sticky top-6"
      >
        <h3 className="text-lg font-semibold text-foreground mb-4 neon-text-glow">
          Profile Preview
        </h3>

        {/* Avatar & basic info */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 neon-glow">
            <Icon name="User" size={32} color="#0F0F0F" />
          </div>
          <h4 className="font-semibold text-foreground text-lg">{mockUserData.name}</h4>
          <p className="text-sm text-muted-foreground">{mockUserData.email}</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/20 text-primary text-sm mt-2 neon-border-glow">
            <Icon name="Crown" size={14} className="mr-1" />
            {mockUserData.accountType}&nbsp;Member
          </div>
        </div>

        {/* Quick stats */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg neon-border-glow">
            <div className="flex items-center space-x-2">
              <Icon name="TrendingUp" size={16} className="text-success" />
              <span className="text-sm font-medium text-foreground">Credit Score</span>
            </div>
            <span className="text-lg font-bold text-success neon-text-glow">
              {mockUserData.creditScore}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg neon-border-glow">
            <div className="flex items-center space-x-2">
              <Icon name="Calendar" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Member Since</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {mockUserData.memberSince}
            </span>
          </div>

          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg neon-border-glow">
            <div className="flex items-center space-x-2">
              <Icon name="Phone" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Phone</span>
            </div>
            <span className="text-sm text-muted-foreground">{mockUserData.phone}</span>
          </div>
        </div>

        {/* Completion bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Profile Complete</span>
            <span className="text-sm text-primary">
              {mockUserData.completionPercentage}%
            </span>
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <motion.div
              className="bg-primary h-2 rounded-full neon-glow"
              initial={{ width: 0 }}
              animate={{ width: `${mockUserData.completionPercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h5 className="font-semibold text-foreground mb-3">Recent Activity</h5>
          <div className="space-y-2">
            {mockUserData.recentActivity.map((act, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex items-center space-x-3 p-2 bg-muted/30 rounded-lg"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-card flex items-center justify-center ${act.color}`}
                >
                  <Icon name={act.icon} size={12} />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground">{act.action}</div>
                  <div className="text-xs text-muted-foreground">{act.time}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Visibility switcher */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card rounded-lg border border-border p-4 shadow-elevation-2 neon-border-glow"
      >
        <h4 className="font-semibold text-foreground mb-3">Profile Visibility</h4>

        {[
          { label: 'Show credit score', defaultChecked: true },
          { label: 'Public profile', defaultChecked: false },
          { label: 'Contact info visible', defaultChecked: true }
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between mb-3 last:mb-0">
            <span className="text-sm text-foreground">{item.label}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                defaultChecked={item.defaultChecked}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary peer-checked:neon-glow" />
            </label>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProfilePreview;
