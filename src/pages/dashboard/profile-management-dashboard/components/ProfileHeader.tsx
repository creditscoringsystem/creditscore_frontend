// src/pages/dashboard/profile-management-dashboard/components/ProfileHeader.tsx
'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

/* ============ CONFIG MÀU ============ */
// Màu neon “đặc trưng” toàn site
const NEON = '#00FF88';

// Preset = đổi màu nền avatar (và viền glow)
type ColorPreset = { id: string; label: string; value: string };
const COLOR_PRESETS: ColorPreset[] = [
  { id: 'neon-green',  label: 'Neon Green',  value: NEON },
  { id: 'neon-red',    label: 'Neon Red',    value: '#FF3B5C' },
  { id: 'neon-yellow', label: 'Neon Yellow', value: '#FFD400' },
  { id: 'neon-purple', label: 'Neon Purple', value: '#8B5CF6' },
  { id: 'pastel-pink', label: 'Pastel Pink', value: '#F9A8D4' },
];

/* Helpers nhỏ */
const hexToRgba = (hex: string, alpha = 1) => {
  const h = hex.replace('#', '');
  const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const MAX_MB = 5;
const ALLOWED = ['image/png', 'image/jpeg'];

const ProfileHeader: React.FC = () => {
  const [completionPercentage] = useState<number>(78);

  // Ảnh & màu
  const [preview, setPreview] = useState<string | null>(null); // DataURL của ảnh upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>(NEON); // mặc định NEON

  // UI
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Xoay ảnh (demo)
  const [rotation, setRotation] = useState(0);
  const rotateOnce = () => setRotation((r) => (r + 90) % 360);

  // Save state
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  /* ---------- Utils ---------- */
  const readFileAsDataURL = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve((e.target?.result as string) ?? '');
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const ensureValid = (file: File): string | null => {
    if (!ALLOWED.includes(file.type)) return 'Chỉ chấp nhận PNG hoặc JPG';
    if (file.size > MAX_MB * 1024 * 1024) return `Kích thước tối đa ${MAX_MB}MB`;
    return null;
  };

  /* ---------- File / DnD ---------- */
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const err = ensureValid(file);
    if (err) return setSaveMsg(err);
    const dataUrl = await readFileAsDataURL(file);
    setSelectedFile(file);
    setPreview(dataUrl);
    setSaveMsg(null);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const err = ensureValid(file);
    if (err) return setSaveMsg(err);
    const dataUrl = await readFileAsDataURL(file);
    setSelectedFile(file);
    setPreview(dataUrl);
    setSaveMsg(null);
  };

  /* ---------- Preset Color ---------- */
  const selectColor = (color: string) => {
    setSelectedColor(color);
    // nếu chưa có ảnh upload, avatar sẽ show nền + glow theo màu này
  };

  /* ---------- Save ---------- */
  const handleUpdatePhoto = async () => {
    if (!preview && !selectedColor) {
      setSaveMsg('Vui lòng chọn ảnh hoặc màu preset.');
      return;
    }
    setSaving(true);
    setSaveMsg(null);

    try {
      if (selectedFile) {
        // === KẾT NỐI BACKEND — UPLOAD ẢNH (multipart/form-data) ===
        // const form = new FormData();
        // form.append('file', selectedFile);
        // form.append('rotation', String(rotation));
        // const res = await fetch('/api/profile/avatar', { method: 'POST', body: form });
        // if (!res.ok) throw new Error('Upload failed');
        // const { url } = await res.json();
        // setPreview(url);
        await new Promise((r) => setTimeout(r, 700)); // demo
      } else {
        // === KẾT NỐI BACKEND — LƯU MÀU PRESET (JSON) ===
        // await fetch('/api/profile/avatar/color', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ color: selectedColor }),
        // });
        await new Promise((r) => setTimeout(r, 400)); // demo
      }
      setSaveMsg('Cập nhật ảnh/ màu thành công ✔');
    } catch (e) {
      setSaveMsg('Có lỗi khi cập nhật. Vui lòng thử lại.');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(null), 2400);
    }
  };

  /* ---------- UI ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border p-6 shadow-elevation-2"
      style={{ background: '#FFFFFF', borderColor: 'var(--color-border,#E5E7EB)' }}
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold" style={{ color: '#0F172A' }}>
            Profile Completion
          </h3>
          <span className="text-sm font-medium" style={{ color: NEON }}>
            {completionPercentage}%
          </span>
        </div>
        <div className="h-2 w-full rounded-full" style={{ background: '#E5E7EB' }}>
          <motion.div
            className="h-2 rounded-full"
            style={{ background: NEON }}
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
        <p className="mt-2 text-sm" style={{ color: '#6B7280' }}>
          Complete your profile to unlock all features
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left: Upload */}
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: '#0F172A' }}>
            Profile Picture
          </h4>

          <div className="flex items-center gap-4">
            {/* Avatar wrapper để đổ glow theo preset */}
            <div
              className="relative rounded-full p-1"
              style={{
                boxShadow: `0 0 24px 6px ${hexToRgba(selectedColor, 0.35)}`,
              }}
            >
              <div
                className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full"
                style={{
                  background: preview ? '#E5E7EB' : selectedColor, // nền = preset khi không có ảnh
                }}
              >
                {preview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={preview}
                    alt="Profile"
                    className="h-full w-full rounded-full object-cover"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                ) : (
                  // icon đen trên nền neon (giống thiết kế bạn gửi)
                  <Icon name="User" size={32} className="text-black" />
                )}
              </div>

              {/* Camera badge viền trắng, nền NEON */}
              <div
                className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2"
                style={{ background: NEON, borderColor: '#FFFFFF' }}
              >
                <Icon name="Camera" size={12} className="text-[#0F172A]" />
              </div>
            </div>

            <div>
              <div className="font-medium" style={{ color: '#0F172A' }}>
                John Doe
              </div>
              <div className="text-sm" style={{ color: '#6B7280' }}>
                Premium Member
              </div>
            </div>
          </div>

          {/* Dropzone */}
          <div
            className={`rounded-lg border-2 border-dashed p-5 text-center transition-all ${
              isDragging ? 'bg-emerald-50' : ''
            }`}
            style={{ borderColor: isDragging ? selectedColor : '#E5E7EB' }}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={22} className="mx-auto mb-2" style={{ color: '#6B7280' }} />
            <p className="mb-1 text-sm" style={{ color: '#6B7280' }}>
              Drag &amp; drop an image or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="underline"
                style={{ color: selectedColor }}
              >
                browse files
              </button>
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>
              Supports PNG, JPG up to {MAX_MB}MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept={ALLOWED.join(',')}
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* Right: Preset Colors + Tools */}
        <div className="space-y-4">
          <h4 className="font-semibold" style={{ color: '#0F172A' }}>
            Preset Avatars
          </h4>

          {/* Swatches màu: border + glow theo màu được chọn */}
          <div className="grid grid-cols-5 gap-3">
            {COLOR_PRESETS.map((c) => {
              const isActive = selectedColor === c.value;
              return (
                <button
                  key={c.id}
                  onClick={() => selectColor(c.value)}
                  aria-label={c.label}
                  className="relative h-12 w-12 rounded-full border transition"
                  style={{
                    background: c.value,
                    borderColor: isActive ? c.value : 'transparent',
                    boxShadow: isActive ? `0 0 0 3px ${hexToRgba(c.value, 0.25)}` : 'none',
                  }}
                >
                  {isActive && (
                    <span
                      className="absolute -right-1 -top-1 inline-flex h-5 w-5 items-center justify-center rounded-full"
                      style={{ background: c.value, color: '#0F172A' }}
                    >
                      <Icon name="Check" size={12} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1" disabled>
              <Icon name="Crop" size={16} className="mr-2" />
              Crop
            </Button>
            <Button variant="outline" size="sm" className="flex-1" onClick={rotateOnce} disabled={!preview}>
              <Icon name="RotateCw" size={16} className="mr-2" />
              Rotate
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 border-t pt-4" style={{ borderColor: '#E5E7EB' }}>
        {saveMsg && (
          <div
            className={`mb-4 rounded-md border px-3 py-2 text-sm ${
              saveMsg.includes('thành công')
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-amber-200 bg-amber-50 text-amber-700'
            }`}
          >
            {saveMsg}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleUpdatePhoto}
            disabled={saving || (!preview && !selectedColor)}
            className={[
              'px-5',
              (preview || selectedColor) ? '!text-[#0F172A]' : 'opacity-60 cursor-not-allowed',
            ].join(' ')}
            style={{ background: NEON }}
            iconName="Save"
          >
            {saving ? 'Updating…' : 'Update Photo'}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
