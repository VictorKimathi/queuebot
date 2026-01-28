import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Filter, MoreVertical, Check, X } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageTransition } from '../components/PageTransition';
interface Ticket {
  id: string;
  number: string;
  status: 'waiting' | 'called' | 'served';
  timestamp: Date;
}
export function StaffDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([
  {
    id: '1',
    number: 'A105',
    status: 'called',
    timestamp: new Date()
  },
  {
    id: '2',
    number: 'A106',
    status: 'waiting',
    timestamp: new Date()
  },
  {
    id: '3',
    number: 'A107',
    status: 'waiting',
    timestamp: new Date()
  },
  {
    id: '4',
    number: 'B201',
    status: 'waiting',
    timestamp: new Date()
  },
  {
    id: '5',
    number: 'B202',
    status: 'waiting',
    timestamp: new Date()
  }]
  );
  const currentTicket = tickets.find((t) => t.status === 'called');
  const waitingTickets = tickets.filter((t) => t.status === 'waiting');
  const callNext = () => {
    if (waitingTickets.length === 0) return;
    const nextTicket = waitingTickets[0];
    setTickets((prev) =>
    prev.map((t) => {
      if (t.id === currentTicket?.id)
      return {
        ...t,
        status: 'served'
      };
      if (t.id === nextTicket.id)
      return {
        ...t,
        status: 'called'
      };
      return t;
    })
    );
  };
  const markServed = () => {
    if (!currentTicket) return;
    setTickets((prev) =>
    prev.map((t) =>
    t.id === currentTicket.id ?
    {
      ...t,
      status: 'served'
    } :
    t
    )
    );
    // Auto call next after delay or manual? Let's keep manual for control
  };
  return (
    <div className="min-h-screen bg-slate-900 text-white flex">
      <Sidebar />

      <main className="flex-1 ml-20 lg:ml-64 p-8 overflow-y-auto h-screen">
        <PageTransition>
          {/* Header */}
          <header className="flex justify-between items-center mb-12">
            <div>
              <h1 className="text-3xl font-bold mb-1">Counter 1 Dashboard</h1>
              <p className="text-slate-400">Manage queue flow and service</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                  size={20} />

                <input
                  type="text"
                  placeholder="Search ticket..."
                  className="bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 w-64" />

              </div>
              <button className="p-2 bg-slate-800 rounded-xl border border-slate-700 hover:bg-slate-700 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
              </button>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500" />
            </div>
          </header>

          <div className="grid xl:grid-cols-3 gap-8">
            {/* Main Action Area */}
            <div className="xl:col-span-2 space-y-8">
              {/* Now Serving Hero */}
              <div className="relative bg-gradient-to-br from-blue-950 to-slate-900 rounded-3xl p-10 border border-white/10 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5">
                  <span className="text-[15rem] font-black leading-none">
                    #
                  </span>
                </div>

                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-green-400 font-medium tracking-wider uppercase text-sm">
                        Now Serving
                      </span>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentTicket?.number || 'none'}
                        initial={{
                          opacity: 0,
                          y: 20
                        }}
                        animate={{
                          opacity: 1,
                          y: 0
                        }}
                        exit={{
                          opacity: 0,
                          y: -20
                        }}
                        className="text-8xl md:text-9xl font-black tracking-tighter mb-2">

                        {currentTicket?.number || '--'}
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-slate-400 text-lg">
                      Ticket ID: #{currentTicket?.id || '--'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button
                      onClick={markServed}
                      disabled={!currentTicket}
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">

                      <Check size={20} /> Mark Served
                    </button>
                    <button
                      onClick={callNext}
                      className="px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 transition-all active:scale-95">

                      Call Next Ticket
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                  <h3 className="text-slate-400 text-sm font-medium mb-1">
                    Waiting
                  </h3>
                  <p className="text-3xl font-bold text-white">
                    {waitingTickets.length}
                  </p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                  <h3 className="text-slate-400 text-sm font-medium mb-1">
                    Served Today
                  </h3>
                  <p className="text-3xl font-bold text-white">142</p>
                </div>
                <div className="bg-slate-800/50 border border-slate-700/50 p-6 rounded-2xl">
                  <h3 className="text-slate-400 text-sm font-medium mb-1">
                    Avg Wait
                  </h3>
                  <p className="text-3xl font-bold text-white">4m 12s</p>
                </div>
              </div>
            </div>

            {/* Queue List */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-3xl p-6 h-[600px] flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Waiting List</h2>
                <button className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                  <Filter size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
                <AnimatePresence>
                  {waitingTickets.map((ticket, index) =>
                  <motion.div
                    key={ticket.id}
                    initial={{
                      opacity: 0,
                      x: 20
                    }}
                    animate={{
                      opacity: 1,
                      x: 0
                    }}
                    exit={{
                      opacity: 0,
                      x: -20
                    }}
                    transition={{
                      delay: index * 0.05
                    }}
                    className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex justify-between items-center group hover:border-slate-600 transition-colors">

                      <div>
                        <span className="text-2xl font-bold block">
                          {ticket.number}
                        </span>
                        <span className="text-xs text-slate-500">
                          Waiting 5m
                        </span>
                      </div>
                      <button className="opacity-0 group-hover:opacity-100 p-2 hover:bg-slate-700 rounded-lg transition-all">
                        <MoreVertical size={20} className="text-slate-400" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {waitingTickets.length === 0 &&
                <div className="text-center py-12 text-slate-500">
                    <p>No tickets in queue</p>
                  </div>
                }
              </div>
            </div>
          </div>
        </PageTransition>
      </main>
    </div>);

}