'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  description?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type = 'text', label, description, error, required = false, id, ...props },
    ref,
  ) => {
    const inputId = id ?? `input-${Math.random().toString(36).substr(2, 9)}`;
    const base =
      'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    if (type === 'checkbox')
      return (
        <input
          id={inputId}
          ref={ref}
          type="checkbox"
          className={cn(
            'h-4 w-4 rounded border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      );

    if (type === 'radio')
      return (
        <input
          id={inputId}
          ref={ref}
          type="radio"
          className={cn(
            'h-4 w-4 rounded-full border border-input bg-background text-primary focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          {...props}
        />
      );

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              error ? 'text-destructive' : 'text-foreground',
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          type={type}
          className={cn(
            base,
            error && 'border-destructive focus-visible:ring-destructive',
            className,
          )}
          {...props}
        />

        {description && !error && <p className="text-sm text-muted-foreground">{description}</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
export default Input;
