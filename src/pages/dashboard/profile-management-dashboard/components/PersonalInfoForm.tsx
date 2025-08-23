// src/pages/dashboard/profile-management-dashboard/components/PersonalInfoForm.tsx
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { getMyProfile, updateMyProfile } from '@/services/profile.service';

/**
 * QUICK API HOOKUP (REST)
 * ------------------------------------------------------------
 * 1) Bật endpoint BE (ví dụ): PUT /api/profile
 *    - Body: { firstName, lastName, email, phone, dateOfBirth, address, city, state, zipCode }
 *    - Trả JSON { ok: true, updatedAt: <ISO string> }
 *
 * 2) Trong handleSave() bên dưới, thay đoạn giả lập bằng:
 *      const res = await fetch('/api/profile', {
 *        method: 'PUT',
 *        headers: { 'Content-Type': 'application/json' },
 *        body: JSON.stringify(form),
 *      });
 *      if (!res.ok) throw new Error('Save failed');
 *      const { updatedAt } = await res.json();
 *      setLastUpdated(new Date(updatedAt));
 *
 * 3) Nếu dùng GraphQL, thay bằng client.mutate(...) tương tự.
 * ------------------------------------------------------------
 */

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

type Field = {
  key: keyof FormData;
  label: string;
  icon: string;
  type: React.HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
};

const FIELDS: Field[] = [
  { key: 'firstName',  label: 'First Name',     icon: 'User',     type: 'text',  required: true,  placeholder: 'John' },
  { key: 'lastName',   label: 'Last Name',      icon: 'User',     type: 'text',  required: true,  placeholder: 'Doe' },
  { key: 'email',      label: 'Email Address',  icon: 'Mail',     type: 'email', required: false, placeholder: 'you@example.com' },
  { key: 'phone',      label: 'Phone Number',   icon: 'Phone',    type: 'tel',   required: false, placeholder: '+1 (555) 123-4567' },
  { key: 'dateOfBirth',label: 'Date of Birth',  icon: 'Calendar', type: 'date' },
  { key: 'address',    label: 'Street Address', icon: 'MapPin',   type: 'text',  placeholder: '123 Main Street' },
  { key: 'city',       label: 'City',           icon: 'MapPin',   type: 'text',  placeholder: 'New York' },
  { key: 'state',      label: 'State',          icon: 'MapPin',   type: 'text',  placeholder: 'NY' },
  { key: 'zipCode',    label: 'ZIP Code',       icon: 'MapPin',   type: 'text',  placeholder: '10001' },
];

const PersonalInfoForm: React.FC = () => {
  // dữ liệu form
  const [form, setForm] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  // trạng thái lưu
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // errors
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // theo dõi “đã chỉnh sửa” để enable nút Save
  const lastSavedRef = useRef<FormData>(form);

  // Load profile hiện tại
  useEffect(() => {
    (async () => {
      try {
        const p = await getMyProfile();
        const fullName = (p.full_name || '').trim();
        let firstName = '';
        let lastName = '';
        if (fullName) {
          const parts = fullName.split(' ');
          firstName = parts.slice(0, -1).join(' ') || parts[0] || '';
          lastName = parts.length > 1 ? parts[parts.length - 1] : '';
        }
        const next: FormData = {
          firstName,
          lastName,
          email: p.email || '',
          phone: p.phone || '',
          dateOfBirth: p.date_of_birth || '',
          address: p.address || '',
          city: '',
          state: '',
          zipCode: '',
        };
        setForm(next);
        lastSavedRef.current = next;
        setLastUpdated(p.updated_at ? new Date(p.updated_at) : new Date());
      } catch {
        // nếu chưa có profile, giữ form trống
      }
    })();
  }, []);
  const isDirty = useMemo(
    () => JSON.stringify(lastSavedRef.current) !== JSON.stringify(form),
    [form]
  );

  const onChange = (k: keyof FormData, v: string) => {
    setForm(s => ({ ...s, [k]: v }));
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }));
  };

  // validate đơn giản
  const validate = (): boolean => {
    const next: Partial<Record<keyof FormData, string>> = {};
    if (!form.firstName.trim()) next.firstName = 'Required';
    if (!form.lastName.trim()) next.lastName = 'Required';
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) next.email = 'Invalid email';
    if (form.phone && form.phone.replace(/\D/g, '').length < 8) next.phone = 'Invalid phone';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSaving(true);
    setSaveMsg(null);

    try {
      // Map sang payload của profile service
      const full_name = [form.firstName, form.lastName].filter(Boolean).join(' ').trim() || null;
      const payload = {
        full_name,
        email: form.email || null,
        phone: form.phone || null,
        address: form.address || null,
        date_of_birth: form.dateOfBirth || null,
      } as any;
      const res = await updateMyProfile(payload);

      lastSavedRef.current = form;
      setLastUpdated(res?.updated_at ? new Date(res.updated_at) : new Date());
      setSaveMsg('Saved successfully');
      // Thông báo toàn cục để Header/khác có thể refetch
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('profile:updated'));
      }
    } catch (e: any) {
      // Hiển thị chi tiết lỗi từ API nếu có
      const apiMsg = axios.isAxiosError(e)
        ? (e.response?.data as any)?.message || e.message
        : (e?.message || 'Unknown error');
      console.error('Update profile failed:', e);
      setSaveMsg(`Save failed: ${apiMsg}`);
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 2500);
    }
  };

  const sinceText = useMemo(() => {
    if (!lastUpdated) return '';
    const diff = Date.now() - lastUpdated.getTime();
    const days = Math.floor(diff / (24 * 3600 * 1000));
    if (days <= 0) return 'just now';
    if (days === 1) return '1 day ago';
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
  }, [lastUpdated]);

  const inputCls =
    'h-11 w-full rounded-lg pl-10 border !bg-white !text-[#0F172A] placeholder-[#9CA3AF] ' +
    'border-[var(--color-border,#E5E7EB)] focus:outline-none focus:ring-2 ' +
    'focus:ring-[var(--color-neon,#12F7A0)] focus:ring-offset-2 focus:ring-offset-white';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border p-6 shadow-elevation-2"
      style={{ background: '#FFFFFF', borderColor: 'var(--color-border,#E5E7EB)' }}
    >
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
          Personal Information
        </h3>

        <div className="flex items-center gap-3">
          <div className="text-sm" style={{ color: '#0F172A' }}>
            Last updated: {sinceText}
          </div>
          <Button
            onClick={handleSave}
            disabled={saving || !isDirty}
            iconName="Save"
            className={[
              '!px-4 !h-9 rounded-lg',
              isDirty
                ? '!bg-[var(--color-neon,#12F7A0)] !text-[#0F172A] hover:opacity-90'
                : 'opacity-60 cursor-not-allowed !bg-[var(--color-neon,#12F7A0)] !text-[#0F172A]',
            ].join(' ')}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Info message */}
      {saveMsg && (
        <div
          className={`mb-4 rounded-md border px-3 py-2 text-sm ${
            saveMsg.startsWith('Saved')
              ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
              : 'border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {saveMsg}
        </div>
      )}

      {/* Form grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELDS.map((f, i) => (
          <motion.div
            key={f.key}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <label className="mb-1 block text-sm font-medium" style={{ color: '#0F172A' }}>
              {f.label} {f.required && <span className="ml-1 text-red-500">*</span>}
            </label>

            <div className="relative">
              <Icon
                name={f.icon}
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
                style={{ color: '#0F172A' }}
              />
              <Input
                type={f.type}
                value={form[f.key] ?? ''}
                onChange={(e) => onChange(f.key, e.target.value)}
                placeholder={f.placeholder}
                className={`${inputCls} ${errors[f.key] ? 'border-rose-400' : ''}`}
                aria-invalid={!!errors[f.key]}
                aria-describedby={errors[f.key] ? `${f.key}-err` : undefined}
                autoComplete="off"
              />
            </div>

            {errors[f.key] && (
              <p id={`${f.key}-err`} className="mt-1 text-xs text-rose-600">
                {errors[f.key]}
              </p>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Changes */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 border-t pt-6"
        style={{ borderColor: 'var(--color-border,#E5E7EB)' }}
      >
        <h4 className="mb-4 font-semibold" style={{ color: '#0F172A' }}>
          Recent Changes
        </h4>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span style={{ color: '#0F172A' }}>Phone number updated</span>
            <span className="text-[var(--color-neon,#12F7A0)]">2 weeks ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: '#0F172A' }}>Email address verified</span>
            <span className="text-[var(--color-neon,#12F7A0)]">1 month ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span style={{ color: '#0F172A' }}>Address information added</span>
            <span className="text-[var(--color-neon,#12F7A0)]">2 months ago</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoForm;
