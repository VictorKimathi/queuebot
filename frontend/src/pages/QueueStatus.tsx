import React, { Children } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock } from 'lucide-react';
import { GradientHero } from '../components/GradientHero';
import { PageTransition } from '../components/PageTransition';
import { TicketCard } from '../components/TicketCard';
export function QueueStatus() {
  // Mock data
  const currentTicket = 'A105';
  const waitingTickets = ['A106', 'A107', 'A108', 'B201', 'B202'];
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
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">

          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>

      <PageTransition className="p-6 max-w-7xl mx-auto">
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
                Please proceed to Counter 1
              </p>
            </motion.div>

            <TicketCard ticketNumber={currentTicket} status="called" isHero />

            <div className="bg-white/5 backdrop-blur rounded-2xl p-6 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                  <Clock size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Average Wait Time</h3>
                  <p className="text-slate-400">
                    Approximately 5 minutes per ticket
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

              {waitingTickets.map((ticket, index) =>
              <motion.div key={ticket} variants={item}>
                  <div className="group flex items-center justify-between p-6 bg-white/5 hover:bg-white/10 backdrop-blur border border-white/10 rounded-xl transition-colors">
                    <div className="flex items-center gap-6">
                      <span className="text-slate-500 font-mono text-sm">
                        #{index + 1}
                      </span>
                      <span className="text-3xl font-bold tracking-tight">
                        {ticket}
                      </span>
                    </div>
                    <div className="px-4 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium border border-blue-500/20">
                      Waiting
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </PageTransition>
    </GradientHero>);

}