import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, History, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
export function Sidebar() {
  const location = useLocation();
  const navItems = [
  {
    icon: LayoutDashboard,
    label: 'Dashboard',
    path: '/staff'
  },
  {
    icon: Users,
    label: 'Active Queue',
    path: '/staff/queue'
  },
  {
    icon: History,
    label: 'History',
    path: '/staff/history'
  }];

  return (
    <aside className="fixed left-0 top-0 h-screen w-20 lg:w-64 bg-slate-950 border-r border-white/10 flex flex-col z-50">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-3 border-b border-white/10">
        <div className="w-8 h-8 rounded bg-orange-500 flex items-center justify-center font-bold text-white">
          Q
        </div>
        <span className="hidden lg:block font-bold text-xl text-white tracking-tight">
          QueuePro
        </span>
      </div>

      <nav className="flex-1 py-8 px-3 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className="block relative group">

              {isActive &&
              <motion.div
                layoutId="activeNav"
                className="absolute inset-0 bg-white/5 rounded-xl border border-white/10 shadow-glow-orange"
                initial={false}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30
                }} />

              }
              <div
                className={`
                relative flex items-center gap-3 px-3 py-3 rounded-xl transition-colors
                ${isActive ? 'text-orange-500' : 'text-slate-400 hover:text-white hover:bg-white/5'}
              `}>

                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                <span className="hidden lg:block font-medium">
                  {item.label}
                </span>
                {isActive &&
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)] hidden lg:block" />
                }
              </div>
            </Link>);

        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors">

          <LogOut size={20} />
          <span className="hidden lg:block font-medium">Exit Staff Mode</span>
        </Link>
      </div>
    </aside>);

}