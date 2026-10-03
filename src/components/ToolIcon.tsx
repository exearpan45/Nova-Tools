import React from 'react';
import * as Icons from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  const IconComponent = (Icons as Record<string, any>)[name] || Icons.Wrench;
  return <IconComponent className={className} />;
};
