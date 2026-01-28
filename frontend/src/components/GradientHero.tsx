import React from 'react';
interface GradientHeroProps {
  children: React.ReactNode;
  className?: string;
}
export function GradientHero({ children, className = '' }: GradientHeroProps) {
  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white overflow-hidden ${className}`}>

      {children}
    </div>);

}