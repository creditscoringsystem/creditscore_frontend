'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

interface NotificationType {
  enabled: boolean;
  email: boolean;
  push: boolean;
  sms: boolean;
}

type CategoryKey =
  | 'creditScoreChanges'
  | 'paymentReminders'
  | 'newInquiries'
  | 'accountUpdates'
  | 'promotionalOffers'
  | 'securityAlerts';

type NotificationsMap = Record<CategoryKey, NotificationType>;

interface CategoryInfo {
  key: CategoryKey;
  title: string;
  description: string;
  icon: string;
}

export default function NotificationSettings() {
  const [notifications, setNotifications] = useState<NotificationsMap>({
    creditScoreChanges: { enabled: true, email: true, push: true, sms: false },
    paymentReminders:  { enabled: true, email: true, push: true, sms: true  },
    newInquiries:       { enabled: true, email: true, push: true, sms: false },
    accountUpdates:     { enabled: true, email: true, push: false, sms: false },
    promotionalOffers:  { enabled: false, email: false, push: false, sms: false },
    securityAlerts:     { enabled: true, email: true, push: true, sms: true  }
  });

  const handleNotificationChange = (
    category: CategoryKey,
    type: keyof NotificationType,
    value: boolean
  ) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [type]: value
      }
    }));
  };

  const toggleCategory = (category: CategoryKey, enabled: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [category]: {
        enabled,
        email: enabled ? prev[category].email : false,
        push:  enabled ? prev[category].push  : false,
        sms:   enabled ? prev[category].sms   : false
      }
    }));
  };

  const notificationCategories: CategoryInfo[] = [
    { key: 'creditScoreChanges', title: 'Credit Score Changes', description: 'Get notified when your credit score increases or decreases', icon: 'TrendingUp' },
    { key: 'paymentReminders',   title: 'Payment Reminders',    description: 'Reminders for upcoming credit card and loan payments',         icon: 'Calendar'   },
    { key: 'newInquiries',       title: 'New Credit Inquiries', description: 'Alerts when new hard or soft inquiries are detected',         icon: 'Search'     },
    { key: 'accountUpdates',     title: 'Account Updates',      description: 'Changes to your credit accounts and balances',                icon: 'RefreshCw'  },
    { key: 'promotionalOffers',  title: 'Promotional Offers',   description: 'Special offers and recommendations based on your profile',      icon: 'Gift'       },
    { key: 'securityAlerts',     title: 'Security Alerts',      description: 'Important security notifications and suspicious activity',    icon: 'Shield'     }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-foreground mb-2 neon-text-glow">
          Notification Preferences
        </h3>
        <p className="text-muted-foreground">
          Choose how and when you want to receive notifications
        </p>
      </div>

      <div className="space-y-4">
        {notificationCategories.map((category, idx) => (
          <motion.div
            key={category.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-muted/50 rounded-lg p-4 neon-border-glow hover-lift"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  notifications[category.key].enabled ? 'bg-primary neon-glow' : 'bg-muted'
                }`}>
                  <Icon
                    name={category.icon}
                    size={20}
                    className={notifications[category.key].enabled ? 'text-foreground' : 'text-muted-foreground'}
                  />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-foreground">{category.title}</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications[category.key].enabled}
                      onChange={e => toggleCategory(category.key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer-checked:bg-primary peer-checked:neon-glow after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                  </label>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {category.description}
                </p>

                {notifications[category.key].enabled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-4"
                  >
                    {(['email', 'push', 'sms'] as (keyof NotificationType)[]).map(type => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[category.key][type]}
                          onChange={e => handleNotificationChange(category.key, type, e.target.checked)}
                          className="w-4 h-4 text-primary focus:ring-primary border-border rounded"
                        />
                        <span className="text-sm text-foreground flex items-center space-x-1">
                          <Icon name={{ email: 'Mail', push: 'Smartphone', sms: 'MessageSquare' }[type]} size={14} />
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                        </span>
                      </label>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex justify-end pt-4 border-t border-border">
        <Button className="px-6 py-3 neon-glow hover:scale-105 transition-all duration-200">
          <Icon name="Save" size={16} className="mr-2" />
          Save Notification Settings
        </Button>
      </motion.div>
    </div>
  );
}
