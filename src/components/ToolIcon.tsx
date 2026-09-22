import React from 'react';
import {
  Calculator,
  Percent,
  Calendar,
  Activity,
  ArrowLeftRight,
  Thermometer,
  HardDrive,
  Clock,
  KeyRound,
  QrCode,
  FileText,
  Type,
  CaseSensitive,
  Braces,
  Binary,
  Wrench
} from 'lucide-react';

interface ToolIconProps {
  name: string;
  className?: string;
}

export const ToolIcon: React.FC<ToolIconProps> = ({ name, className = 'w-5 h-5' }) => {
  switch (name) {
    case 'Calculator':
      return <Calculator className={className} />;
    case 'Percent':
      return <Percent className={className} />;
    case 'Calendar':
      return <Calendar className={className} />;
    case 'Activity':
      return <Activity className={className} />;
    case 'ArrowLeftRight':
      return <ArrowLeftRight className={className} />;
    case 'Thermometer':
      return <Thermometer className={className} />;
    case 'HardDrive':
      return <HardDrive className={className} />;
    case 'Clock':
      return <Clock className={className} />;
    case 'KeyRound':
      return <KeyRound className={className} />;
    case 'QrCode':
      return <QrCode className={className} />;
    case 'FileText':
      return <FileText className={className} />;
    case 'Type':
      return <Type className={className} />;
    case 'CaseSensitive':
      return <CaseSensitive className={className} />;
    case 'Braces':
      return <Braces className={className} />;
    case 'Binary':
      return <Binary className={className} />;
    default:
      return <Wrench className={className} />;
  }
};
