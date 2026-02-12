import { ReactNode } from 'react';

export interface ContactCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  bgColor: string;
  borderColor: string;
  children: ReactNode;
  hoverColor: string;
}

export interface SupportFeature {
  icon: ReactNode;
  title: string;
  description: string;
}

export interface QuickTip {
  color: string;
  icon: string;
  title: string;
  description: string;
}