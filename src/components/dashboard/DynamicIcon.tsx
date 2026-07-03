import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps extends Omit<Icons.LucideProps, 'name'> {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = Icons[name as keyof typeof Icons] as React.ComponentType<Icons.LucideProps> | undefined;

  if (!IconComponent) {
    // Return a fallback file icon if the specified icon isn't found
    return <Icons.File {...props} />;
  }

  return <IconComponent {...props} />;
}
