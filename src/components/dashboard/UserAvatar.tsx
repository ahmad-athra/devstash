'use client';

import React, { useMemo } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserAvatarProps {
  name?: string | null;
  image?: string | null;
  className?: string;
  size?: 'default' | 'sm' | 'lg';
}

export default function UserAvatar({
  name,
  image,
  className = 'size-9 text-xs',
  size = 'default',
}: UserAvatarProps) {
  const initials = useMemo(() => {
    if (!name) return '?';
    return name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  }, [name]);

  return (
    <Avatar size={size} className={className}>
      {image && (
        <AvatarImage
          src={image}
          alt={name || 'User avatar'}
        />
      )}
      <AvatarFallback className="bg-gradient-to-br from-blue-600/80 to-purple-600/80 font-bold text-white shadow-inner select-none text-[11px]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
