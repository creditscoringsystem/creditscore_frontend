// app/(dashboard)/profile/components/PersonalInfoForm.tsx   (ví dụ path)
'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '@/components/AppIcon';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

/* ------------ Kiểu dữ liệu ------------ */
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
  socialSecurityNumber: string;
}

type EditingState = Record<string, boolean>;
type ValidationErrors = Record<string, string | null>;

interface ProfileField {
  key: keyof FormData;
  label: string;
  icon: string;       // tên icon trong lucide-react
  type: React.HTMLInputTypeAttribute;
  required: boolean;
}

/* ------------ Component ------------ */
const PersonalInfoForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    socialSecurityNumber: '***-**-****'
  });

  const [editingFields, setEditingFields] = useState<EditingState>({});
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  /* ---------- Handlers ---------- */
  const handleFieldEdit = (field: keyof FormData) => {
    setEditingFields((prev) => ({ ...prev, [field]: true }));
  };

  const handleFieldSave = (field: keyof FormData) => {
    if (!formData[field]?.trim()) {
      setValidationErrors((prev) => ({
        ...prev,
        [field]: 'This field is required'
      }));
      return;
    }
    setEditingFields((prev) => ({ ...prev, [field]: false }));
    setValidationErrors((prev) => ({ ...prev, [field]: null }));
  };

  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  /* ---------- Field config ---------- */
  const profileFields: ProfileField[] = [
    { key: 'firstName',  label: 'First Name',  icon: 'User',      type: 'text',  required: true },
    { key: 'lastName',   label: 'Last Name',   icon: 'User',      type: 'text',  required: true },
    { key: 'email',      label: 'Email Address', icon: 'Mail',   type: 'email', required: true },
    { key: 'phone',      label: 'Phone Number',  icon: 'Phone',  type: 'tel',   required: true },
    { key: 'dateOfBirth',label: 'Date of Birth', icon: 'Calendar',type: 'date', required: false },
    { key: 'address',    label: 'Street Address',icon: 'MapPin', type: 'text',  required: false },
    { key: 'city',       label: 'City',          icon: 'MapPin', type: 'text',  required: false },
    { key: 'state',      label: 'State',         icon: 'MapPin', type: 'text',  required: false },
    { key: 'zipCode',    label: 'ZIP Code',      icon: 'MapPin', type: 'text',  required: false }
  ];

  /* ---------- Render ---------- */
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-card rounded-lg border border-border p-6 shadow-elevation-2 neon-border-glow"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground neon-text-glow">
          Personal Information
        </h3>
        <div className="text-sm text-muted-foreground">Last updated: 2 weeks ago</div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {profileFields.map((field, index) => (
          <motion.div
            key={field.key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="space-y-2"
          >
            <label className="block text-sm font-medium text-foreground">
              {field.label}
              {field.required && <span className="text-destructive ml-1">*</span>}
            </label>

            <div className="relative group">
              {editingFields[field.key] ? (
                /* --- Edit mode --- */
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <Icon
                      name={field.icon}
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    />
                    <Input
                      type={field.type}
                      value={formData[field.key] || ''}
                      onChange={(e) => handleFieldChange(field.key, e.target.value)}
                      className={`pl-10 neon-border-glow ${
                        validationErrors[field.key] ? 'border-destructive' : ''
                      }`}
                      placeholder={`Enter ${field.label.toLowerCase()}`}
                    />
                  </div>
                  <Button size="sm" onClick={() => handleFieldSave(field.key)} className="neon-glow">
                    <Icon name="Check" size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingFields((prev) => ({ ...prev, [field.key]: false }))}
                    className="neon-border-glow"
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ) : (
                /* --- Display mode --- */
                <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/50 hover:neon-border-glow transition-all duration-200 group-hover:bg-muted/70">
                  <div className="flex items-center space-x-3">
                    <Icon name={field.icon} size={16} className="text-muted-foreground" />
                    <span className="text-foreground">
                      {formData[field.key] || 'Not set'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFieldEdit(field.key)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity hover:neon-border-glow"
                  >
                    <Icon name="Edit2" size={14} />
                  </Button>
                </div>
              )}

              {validationErrors[field.key] && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-destructive mt-1"
                >
                  {validationErrors[field.key]}
                </motion.p>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent changes */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 pt-6 border-t border-border"
      >
        <h4 className="font-semibold text-foreground mb-4">Recent Changes</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Phone number updated</span>
            <span className="text-primary">2 weeks ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Email address verified</span>
            <span className="text-success">1 month ago</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Address information added</span>
            <span className="text-primary">2 months ago</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PersonalInfoForm;
