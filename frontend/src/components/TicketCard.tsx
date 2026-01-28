import React from 'react';
import { motion } from 'framer-motion';
interface TicketCardProps {
  ticketNumber: string;
  status: 'waiting' | 'called' | 'served';
  className?: string;
  isHero?: boolean;
}
export function TicketCard({
  ticketNumber,
  status,
  className = '',
  isHero = false
}: TicketCardProps) {
  const statusColors = {
    waiting: 'bg-white/10 border-white/20 text-white',
    called: 'bg-orange-500 border-orange-400 text-white shadow-glow-orange',
    served: 'bg-green-500/20 border-green-500/30 text-green-100'
  };
  return (
    <motion.div
      whileHover={{
        y: -5,
        scale: 1.02
      }}
      className={`
        relative overflow-hidden rounded-2xl backdrop-blur-md border shadow-dramatic
        flex flex-col items-center justify-center
        ${statusColors[status]}
        ${isHero ? 'p-12 aspect-square max-w-md mx-auto' : 'p-6 aspect-video'}
        ${className}
      `}>

      <span
        className={`uppercase tracking-widest font-medium opacity-80 ${isHero ? 'text-xl mb-4' : 'text-xs mb-2'}`}>

        {status === 'called' ? 'Now Serving' : 'Ticket Number'}
      </span>
      <span
        className={`font-black tracking-tighter leading-none ${isHero ? 'text-9xl' : 'text-5xl'}`}>

        {ticketNumber}
      </span>
      {status === 'waiting' &&
      <div className="mt-4 flex items-center gap-2 text-sm opacity-60">
          <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          In Queue
        </div>
      }
    </motion.div>);

}