'use client';

import React, { useState, ChangeEvent } from 'react';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';

type NotificationType = 'success' | 'warning' | 'alert';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: NotificationType;
  unread: boolean;
}

const Header: React.FC = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [showNotifications, setShowNotifications] = useState<boolean>(false);

  const mockNotifications: Notification[] = [
    {
      id: 1,
      title: 'Credit Score Update',
      message: 'Your credit score has increased by 15 points',
      time: '2 min ago',
      type: 'success',
      unread: true,
    },
    {
      id: 2,
      title: 'Payment Reminder',
      message: 'Credit card payment due in 3 days',
      time: '1 hour ago',
      type: 'warning',
      unread: true,
    },
    {
      id: 3,
      title: 'New Credit Inquiry',
      message: 'Hard inquiry detected from ABC Bank',
      time: '3 hours ago',
      type: 'alert',
      unread: false,
    },
  ];

  const unreadCount = mockNotifications.filter(n => n.unread).length;

  return (
    <header className="fixed top-0 left-80 right-0 z-30 bg-card border-b border-border shadow-elevation-1">
      <div className="flex items-center justify-between h-20 px-6">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search transactions, reports, or settings..."
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-smooth"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-4 ml-6">
          {/* Notifications */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2"
            >
              <Icon name="Bell" size={20} />
              {unreadCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center neon-glow"
                >
                  {unreadCount}
                </motion.span>
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevation-3 py-4 z-50"
              >
                <div className="flex items-center justify-between px-4 pb-3 border-b border-border">
                  <h3 className="font-semibold text-foreground">Notifications</h3>
                  <button className="text-sm text-primary hover:underline">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockNotifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`px-4 py-3 border-b border-border last:border-b-0 hover:bg-muted transition-smooth ${
                        notification.unread ? 'bg-muted/50' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div
                          className={`w-2 h-2 rounded-full mt-2 ${
                            notification.type === 'success'
                              ? 'bg-success'
                              : notification.type === 'warning'
                              ? 'bg-warning'
                              : 'bg-error'
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">
                            {notification.title}
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </div>
                        </div>
                        {notification.unread && (
                          <div className="w-2 h-2 bg-primary rounded-full border-2 border-card neon-glow" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 pt-3 border-t border-border">
                  <button className="text-sm text-primary hover:underline">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block text-right">
              <div className="text-sm font-medium text-foreground">John Doe</div>
              <div className="text-xs text-muted-foreground">Premium Member</div>
            </div>
            <div className="relative">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center neon-glow cursor-pointer hover:scale-105 transition-smooth">
                <Icon name="User" size={20} color="#0F0F0F" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-card neon-glow" />
            </div>
          </div>
        </div>
      </div>

      {/* Close notifications overlay */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default Header;
