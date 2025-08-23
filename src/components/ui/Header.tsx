'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';
import { motion } from 'framer-motion';
import { getMyProfile } from '@/services/profile.service';

type NotificationType = 'success' | 'warning' | 'alert';
interface Notification { id: number; title: string; message: string; time: string; type: NotificationType; unread: boolean; }

interface HeaderProps { onToggleSidebar?: () => void; }

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [searchValue, setSearchValue] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);

  const seed: Notification[] = [
    { id: 1, title: 'Credit Score Update', message: 'Your credit score has increased by 15 points', time: '2 min ago',  type: 'success', unread: true },
    { id: 2, title: 'Payment Reminder',    message: 'Credit card payment due in 3 days',          time: '1 hour ago', type: 'warning', unread: true },
    { id: 3, title: 'New Credit Inquiry',  message: 'Hard inquiry detected from ABC Bank',        time: '3 hours ago',type: 'alert',  unread: false },
  ];
  const [notifications, setNotifications] = useState<Notification[]>(seed);
  const unread = notifications.filter(n => n.unread).length;

  const markAllRead = () =>
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

  const typeDot = (t: NotificationType) =>
    t === 'success' ? '#12F7A0' : t === 'warning' ? '#F59E0B' : '#EF4444';

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-[#E5E7EB]">
      <div className="relative mx-auto max-w-[1200px] px-6 h-20 flex items-center">
        {/* LEFT (menu + brand) — đẩy hẳn về trái bằng negative margin */}
        <div className="flex items-center gap-3 min-w-0 -ml-3 md:-ml-6 lg:-ml-8 xl:-ml-10">
          <button
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
            className="p-2 rounded-lg border border-[#E5E7EB] hover:bg-[#F8F9FA] transition"
          >
            <Icon name="Menu" size={20} />
          </button>

          <div className="flex items-center gap-3 min-w-0">
            <Image src="/logo.svg" alt="Logo" width={40} height={40} />
            <span className="font-bold text-xl bg-gradient-to-r from-[#22A521] to-[#00FF88] bg-clip-text text-transparent truncate">
              Credit Scoring System
            </span>
          </div>
        </div>

        {/* CENTER – search pill nằm đúng tâm */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(60vw,520px)] min-w-[280px]">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
            <input
              type="text"
              placeholder="Search transactions, reports, or settings..."
              value={searchValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchValue(e.target.value)}
              className="w-full h-12 pl-12 pr-10 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full shadow-sm
                         text-[#111827] placeholder-[#9CA3AF]
                         focus:outline-none focus:ring-2 focus:ring-[#00FF88] focus:border-transparent"
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827]"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="ml-auto flex items-center gap-4">
          <div className="relative">
            <Button variant="ghost" size="sm" onClick={() => setShowNotifications(v => !v)} className="relative p-2">
              <Icon name="Bell" size={20} />
              {unread > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-[#00FF88] text-[#0F0F0F] text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unread}
                </motion.span>
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 top-full mt-2 w-96 bg-white border border-[#E5E7EB] rounded-lg shadow z-50"
                role="menu"
              >
                {/* Header dòng 1 */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E5E7EB]">
                  <span className="font-semibold text-[#111827]">Notifications</span>
                  <button
                    onClick={markAllRead}
                    className="text-sm text-[#10B981] hover:opacity-80"
                  >
                    Mark all read
                  </button>
                </div>

                {/* List */}
                <div className="max-h-80 overflow-auto divide-y divide-[#F1F5F9]">
                  {notifications.map((n) => (
                    <div key={n.id} className="px-4 py-3 hover:bg-[#F8F9FA] transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span
                              className="inline-block w-2.5 h-2.5 rounded-full"
                              style={{ background: typeDot(n.type) }}
                            />
                            <div className="font-medium text-[#111827] truncate">
                              {n.title}
                            </div>
                          </div>
                          <div className="text-sm text-[#6B7280] mt-1 truncate">
                            {n.message}
                          </div>
                          <div className="text-xs text-[#6B7280] mt-1">{n.time}</div>
                        </div>

                        {/* unread dot ở bên phải */}
                        <span
                          className="w-2 h-2 rounded-full mt-1"
                          style={{ background: n.unread ? '#12F7A0' : '#E5E7EB' }}
                          aria-hidden
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer link */}
                <Link
                  href="/dashboard/alert-management-dashboard"
                  className="block text-center px-4 py-3 text-[#10B981] hover:bg-[#F8FFFB] rounded-b-lg"
                >
                  View all notifications
                </Link>
              </motion.div>
            )}
          </div>

          <HeaderUserName />
          <HeaderAvatar />
        </div>
      </div>
    </header>
  );
};

export default Header;

// Subcomponent: fetch display name/email và lắng nghe cập nhật
const HeaderUserName: React.FC = () => {
  const [name, setName] = useState<string>('');

  useEffect(() => {
    let mounted = true;
    const fetchName = async () => {
      try {
        const p = await getMyProfile();
        if (!mounted) return;
        const full = (p.full_name || '').trim();
        setName(full || (p.email || ''));
      } catch {
        // ignore
      }
    };
    fetchName();
    const onUpdated = () => fetchName();
    if (typeof window !== 'undefined') {
      window.addEventListener('profile:updated', onUpdated as any);
    }
    return () => {
      mounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('profile:updated', onUpdated as any);
      }
    };
  }, []);

  return (
    <div className="hidden md:block text-right">
      <div className="text-sm font-medium text-[#111827]">{name || '—'}</div>
      <div className="text-xs text-[#6B7280]">Premium Member</div>
    </div>
  );
};

// Subcomponent: avatar thật nếu có, fallback icon
const HeaderAvatar: React.FC = () => {
  const [avatar, setAvatar] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchAvatar = async () => {
      try {
        const p = await getMyProfile();
        if (!mounted) return;
        setAvatar(p.avatar || null);
      } catch {
        // ignore
      }
    };
    fetchAvatar();
    const onUpdated = () => fetchAvatar();
    if (typeof window !== 'undefined') {
      window.addEventListener('profile:updated', onUpdated as any);
    }
    return () => {
      mounted = false;
      if (typeof window !== 'undefined') {
        window.removeEventListener('profile:updated', onUpdated as any);
      }
    };
  }, []);

  return (
    <div className="relative">
      <div className="w-10 h-10 bg-[#00FF88] rounded-full flex items-center justify-center overflow-hidden">
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          <Icon name="User" size={20} color="#0F0F0F" />
        )}
      </div>
      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#00FF88] rounded-full border-2 border-white" />
    </div>
  );
};
