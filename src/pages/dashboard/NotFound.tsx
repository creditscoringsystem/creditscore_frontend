// src/pages/dashboard/NotFound.tsx
'use client';

import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Icon from '@/components/AppIcon';

export default function NotFoundPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <h1 className="text-9xl font-bold text-primary opacity-20">404</h1>
        </div>
        <h2 className="text-2xl font-medium text-onBackground mb-2">Page Not Found</h2>
        <p className="text-onBackground/70 mb-8">
          The page you're looking for doesn't exist. Let's get you back!
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="default"
            onClick={() => router.back()}
          >
            <Icon name="ArrowLeft" size={16} className="-ml-1 mr-2" />
            Go Back
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push('/')}
          >
            <Icon name="Home" size={16} className="-ml-1 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
