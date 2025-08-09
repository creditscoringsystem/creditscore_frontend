// app/(dashboard)/profile/components/ProfileHeader.tsx
'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Button from '@/components/ui/Button';

/* ---------- Kiểu dữ liệu ---------- */
interface PresetAvatar {
  id: number;
  url: string;
  label: string;
}

const ProfileHeader: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | ArrayBuffer | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [completionPercentage] = useState<number>(78);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const presetAvatars: PresetAvatar[] = [
    { id: 1, url: '/api/placeholder/40/40', label: 'Avatar 1' },
    { id: 2, url: '/api/placeholder/40/40', label: 'Avatar 2' },
    { id: 3, url: '/api/placeholder/40/40', label: 'Avatar 3' },
    { id: 4, url: '/api/placeholder/40/40', label: 'Avatar 4' }
  ];

  /* ---------- Handlers ---------- */
  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setAvatarPreview(e.target?.result ?? null);
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setAvatarPreview(ev.target?.result ?? null);
      reader.readAsDataURL(file);
    }
  };

  const selectPresetAvatar = (url: string) => {
    setAvatarPreview(url);
  };

  /* ---------- UI ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 neon-border-glow"
    >
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-foreground neon-text-glow">
            Profile Completion
          </h3>
          <span className="text-sm text-primary font-medium">
            {completionPercentage}%
          </span>
        </div>
        <div className="w-full bg-border rounded-full h-2">
          <motion.div
            className="bg-primary h-2 rounded-full neon-glow"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Complete your profile to unlock all features
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* -------- Avatar upload -------- */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Profile Picture</h4>

          {/* Current avatar */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center neon-glow overflow-hidden">
                {avatarPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={avatarPreview as string}
                    alt="Profile"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Icon name="User" size={32} color="#0F0F0F" />
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-success rounded-full border-2 border-card neon-glow flex items-center justify-center">
                <Icon name="Camera" size={12} color="#0F0F0F" />
              </div>
            </div>
            <div>
              <div className="font-medium text-foreground">John Doe</div>
              <div className="text-sm text-muted-foreground">Premium Member</div>
            </div>
          </div>

          {/* Drag & Drop zone */}
          <div
            className={`border-2 border-dashed rounded-lg p-4 text-center transition-all duration-200 ${
              isDragging
                ? 'border-primary bg-primary/10 neon-border-glow'
                : 'border-border hover:border-primary/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Icon name="Upload" size={24} className="mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground mb-2">
              Drag &amp; drop an image or{' '}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-primary hover:underline"
              >
                browse files
              </button>
            </p>
            <p className="text-xs text-muted-foreground">Supports PNG, JPG up to 5 MB</p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {/* -------- Preset avatars -------- */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Preset Avatars</h4>
          <div className="grid grid-cols-4 gap-2">
            {presetAvatars.map((preset) => (
              <motion.button
                key={preset.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => selectPresetAvatar(preset.url)}
                className={`w-12 h-12 rounded-full bg-muted overflow-hidden border-2 transition-all duration-200 ${
                  avatarPreview === preset.url
                    ? 'border-primary neon-glow'
                    : 'border-transparent hover:border-primary/50'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1 neon-border-glow">
              <Icon name="Crop" size={16} className="mr-2" />
              Crop
            </Button>
            <Button variant="outline" size="sm" className="flex-1 neon-border-glow">
              <Icon name="RotateCw" size={16} className="mr-2" />
              Rotate
            </Button>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end mt-6 pt-4 border-t border-border">
        <Button className="px-6 py-2 neon-glow hover:scale-105 transition-all duration-200">
          <Icon name="Save" size={16} className="mr-2" />
          Update Photo
        </Button>
      </div>
    </motion.div>
  );
};

export default ProfileHeader;
