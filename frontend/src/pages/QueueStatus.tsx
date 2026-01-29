import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, RefreshCw } from 'lucide-react';
import { GradientHero } from '../components/GradientHero';
import { PageTransition } from '../components/PageTransition';
import { TicketCard } from '../components/TicketCard';
import { getWaitingTickets, getNowServing, Ticket } from '../api';

export function QueueStatus() {
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [waitingTickets, setWaitingTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const [nowServingRes, waitingRes] = await Promise.all([
        getNowServing(),
        getWaitingTickets(),
      ]);
      if (nowServingRes.ok) setCurrentTicket(nowServingRes.ticket);
      if (waitingRes.ok) setWaitingTickets(waitingRes.tickets);
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 10 seconds
    const interval = setInterval(() => fetchData(), 10000);
    return () => clearInterval(interval);
  }, []);

  const container = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const item = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return (
    <GradientHero>
      <div className="p-6 flex justify-between items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">

          <ArrowLeft size={20} /> Back to Home
        </Link>
        <button
          onClick={() => fetchData(true)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors disabled:opacity-50">
          <RefreshCw size={20} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      <PageTransition className="p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left Column: Now Serving */}
            <div className="space-y-8">
              <motion.div
                initial={{
                  opacity: 0,
                  x: -20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.2
                }}>

                <h1 className="text-4xl font-bold mb-2">Now Serving</h1>
                <p className="text-slate-400 text-lg">
                  {currentTicket ? `Counter ${currentTicket.counter_id || 1}` : 'No one is being served'}
                </p>
              </motion.div>

              {currentTicket ? (
                <TicketCard ticketNumber={String(currentTicket.ticket_number)} status="called" isHero />
              ) : (
                <div className="bg-white/5 backdrop-blur rounded-2xl p-12 border border-white/10 text-center">
                  <p className="text-slate-400 text-xl">Queue is empty</p>
                </div>
              )}

              <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Queue Status</h3>
                    <p className="text-slate-400">
                      {waitingTickets.length} {waitingTickets.length === 1 ? 'person' : 'people'} waiting
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Up Next */}
            <div>
              <motion.div
                initial={{
                  opacity: 0,
                  x: 20
                }}
                animate={{
                  opacity: 1,
                  x: 0
                }}
                transition={{
                  delay: 0.3
                }}
                className="mb-8">

                <h2 className="text-3xl font-bold mb-2">Up Next</h2>
                <p className="text-slate-400">Prepare to be called</p>
              </motion.div>

              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4">

                {waitingTickets.length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p>No tickets in queue</p>
                  </div>
                ) : (
                  waitingTickets.map((ticket, index) =>
                    <motion.div key={ticket.id} variants={item}>
                      <div className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 rounded-xl transition-colors">
                        <div className="flex items-center gap-6">
                          <span className="text-slate-500 font-mono text-sm">
                            #{index + 1}
                          </span>
                          <span className="text-3xl font-bold tracking-tight">
                            {ticket.ticket_number}
                          </span>
                        </div>
                        <div className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                          Waiting
                        </div>
                      </div>
                    </motion.div>
                  )
                )}
              </motion.div>
            </div>
          </div>
        )}
      </PageTransition>
    </GradientHero>);

}