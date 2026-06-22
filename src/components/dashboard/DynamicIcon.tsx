import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps extends Omit<React.ComponentProps<any>, 'name'> {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = (Icons as any)[name];

  if (!IconComponent) {
    // Return a fallback file icon if the specified icon isn't found
    return <Icons.File {...props} />;
  }

  return <IconComponent {...props} />;
}
