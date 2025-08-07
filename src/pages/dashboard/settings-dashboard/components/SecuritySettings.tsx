'use client';

import { useState, ChangeEvent, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

interface PasswordForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

type StatStatus = 'success' | 'warning' | 'error' | 'info' | 'normal';

interface SecurityStat {
  label: string;
  value: string;
  status: StatStatus;
}

interface Activity {
  action: string;
  location: string;
  time: string;
  status: StatStatus;
}

export default function SecuritySettings() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (field: keyof PasswordForm, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Password change logic
    console.log('Changing password');
    setShowPasswordForm(false);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const securityStats: SecurityStat[] = [
    { label: 'Password Strength',     value: 'Strong',             status: 'success' },
    { label: 'Last Password Change',  value: '3 months ago',      status: 'warning' },
    { label: 'Active Sessions',       value: '3 devices',         status: 'info'    },
    { label: '2FA Status',            value: twoFactorEnabled ? 'Enabled' : 'Disabled', status: twoFactorEnabled ? 'success' : 'error' }
  ];

  const recentActivity: Activity[] = [
    { action: 'Login from Chrome',         location: 'New York, NY', time: '2 hours ago',   status: 'normal'  },
    { action: 'Password reset request',    location: 'Unknown',     time: '1 week ago',   status: 'warning' },
    { action: 'Login from Mobile App',     location: 'New York, NY', time: '3 days ago',    status: 'normal'  },
    { action: 'Account settings updated',  location: 'New York, NY', time: '1 week ago',    status: 'normal'  }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Security Overview */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Security Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {securityStats.map(stat => (
            <div key={stat.label} className="bg-muted/50 rounded-lg p-4 neon-border-glow">
              <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
              <div className={`text-lg font-semibold ${
                stat.status === 'success' ? 'text-success' :
                stat.status === 'warning' ? 'text-warning' :
                stat.status === 'error'   ? 'text-destructive' :
                stat.status === 'info'    ? 'text-foreground'  :
                'text-foreground'
              }`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Password Management */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Password Management
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          {!showPasswordForm ? (
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-foreground">Password</div>
                <div className="text-sm text-muted-foreground">Last changed 3 months ago</div>
              </div>
              <Button variant="outline" onClick={() => setShowPasswordForm(true)} className="neon-border-glow">
                <Icon name="Key" size={16} className="mr-2" />
                Change Password
              </Button>
            </div>
          ) : (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <Input
                type="password"
                placeholder="Current Password"
                value={passwordForm.currentPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange('currentPassword', e.target.value)}
                className="neon-border-glow"
                required
              />
              <Input
                type="password"
                placeholder="New Password"
                value={passwordForm.newPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange('newPassword', e.target.value)}
                className="neon-border-glow"
                required
              />
              <Input
                type="password"
                placeholder="Confirm New Password"
                value={passwordForm.confirmPassword}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handlePasswordChange('confirmPassword', e.target.value)}
                className="neon-border-glow"
                required
              />
              <div className="flex space-x-2">
                <Button type="submit" className="neon-glow">
                  Update Password
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowPasswordForm(false)} className="neon-border-glow">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </motion.div>

      {/* Two-Factor Authentication */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Two-Factor Authentication
        </h3>
        <div className="bg-muted/50 rounded-lg p-4 neon-border-glow">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                twoFactorEnabled ? 'bg-success neon-glow' : 'bg-muted'
              }`}>
                <Icon name="Shield" size={20} className={twoFactorEnabled ? 'text-foreground' : 'text-muted-foreground'} />
              </div>
              <div>
                <div className="font-medium text-foreground">Two-Factor Authentication</div>
                <div className="text-sm text-muted-foreground">
                  {twoFactorEnabled ?
                    'Your account is protected with 2FA' :
                    'Add an extra layer of security'
                  }
                </div>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={twoFactorEnabled}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setTwoFactorEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-muted peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer-checked:bg-primary peer-checked:neon-glow after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-4">
        <h3 className="text-xl font-semibold text-foreground mb-4 neon-text-glow">
          Recent Security Activity
        </h3>
        <div className="bg-muted/50 rounded-lg neon-border-glow">
          {recentActivity.map((activity, idx) => (
            <div key={idx} className={`p-4 flex items-center justify-between ${
              idx !== recentActivity.length - 1 ? 'border-b border-border' : ''
            }`}>
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'warning' ? 'bg-warning' : 'bg-success'
                }`} />
                <div>
                  <div className="font-medium text-foreground">{activity.action}</div>
                  <div className="text-sm text-muted-foreground">{activity.location}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">{activity.time}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
