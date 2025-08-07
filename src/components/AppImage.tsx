// src/components/AppImage.tsx
'use client';

import React from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  alt = 'Image',
  className = '',
  ...props
}) => (
  <img
    src={src}
    alt={alt}
    className={className}
    onError={e => {
      (e.currentTarget as HTMLImageElement).src = '/assets/images/no_image.png';
    }}
    {...props}
  />
);

export default Image;
