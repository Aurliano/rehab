import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  title: string;
  icon: LucideIcon;
  variant?: 'primary' | 'secondary';
}

export interface PatientInfo {
  name: string;
  fileNumber: string;
  protocol: string;
}

export interface NextSession {
  date: string;
  time: string;
  duration: string;
}

export interface EquipmentStatus {
  id: string;
  name: string;
  status: 'ready' | 'needs-check' | 'offline';
  icon: LucideIcon;
}
