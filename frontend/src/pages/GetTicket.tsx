import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { GradientHero } from '../components/GradientHero';
import { PageTransition } from '../components/PageTransition';
import { joinQueue, Ticket } from '../api';

export function GetTicket() {
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [showForm, setShowForm] = useState(true);

  const generateTicket = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = await joinQueue(name, phone || undefined, 'general');
      if (result.ok) {
        setTicket(result.ticket);
        setShowForm(false);
      } else {
        setError('Failed to get ticket. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <GradientHero className="flex flex-col">
      <div className="p-6">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors">

          <ArrowLeft size={20} /> Back to Home
        </Link>
      </div>

      <PageTransition className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait">
            {!ticket ?
              <motion.div
                key="generate"
                initial={{
                  opacity: 0,
                  scale: 0.9
                }}
                animate={{
                  opacity: 1,
                  scale: 1
                }}
                exit={{
                  opacity: 0,
                  scale: 0.9
                }}
                className="text-center">

                <h1 className="text-5xl md:text-7xl font-bold mb-8">
                  Ready to join?
                </h1>
                <p className="text-xl text-slate-400 mb-8 max-w-lg mx-auto">
                  Enter your details below to get your ticket number
                  and join the queue.
                </p>

                <div className="max-w-md mx-auto space-y-4 mb-8">
                  <input
                    type="text"
                    placeholder="Your Name *"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number (optional)"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-6 py-4 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {error && (
                  <p className="text-red-400 mb-4">{error}</p>
                )}

                <button
                  onClick={generateTicket}
                  disabled={loading}
                  className="group relative inline-flex items-center justify-center px-12 py-8 text-2xl font-bold text-white bg-orange-500 rounded-2xl shadow-dramatic overflow-hidden transition-transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed">

                  <span className="relative z-10 flex items-center gap-3">
                    {loading ?
                      <>
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                        Printing Ticket...
                      </> :

                      <>
                        <Printer size={32} />
                        Get My Ticket
                      </>
                    }
                  </span>
                  <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </button>
              </motion.div> :

              <motion.div
                key="result"
                initial={{
                  opacity: 0,
                  scale: 0.8,
                  rotateX: -20
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  rotateX: 0
                }}
                className="bg-white text-slate-900 rounded-3xl p-12 shadow-dramatic text-center relative overflow-hidden">

                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 to-orange-600" />

                <motion.div
                  initial={{
                    scale: 0
                  }}
                  animate={{
                    scale: 1
                  }}
                  transition={{
                    delay: 0.3,
                    type: 'spring'
                  }}
                  className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">

                  <CheckCircle size={40} />
                </motion.div>

                <h2 className="text-2xl font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Your Ticket Number
                </h2>
                <div className="text-9xl md:text-[10rem] font-black tracking-tighter leading-none mb-8 text-slate-900">
                  {ticket.ticket_number}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-500">Service Type</span>
                    <span className="font-bold text-slate-900 capitalize">{ticket.service_type}</span>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-4" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-500">Status</span>
                    <span className="font-bold text-slate-900 capitalize">{ticket.status}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                    to="/customer/status"
                    className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors text-center">

                    View Status
                  </Link>
                  <button
                    onClick={() => {
                      setTicket(null);
                      setName('');
                      setPhone('');
                      setShowForm(true);
                    }}
                    className="px-6 py-4 border-2 border-slate-200 rounded-xl font-bold hover:bg-slate-50 transition-colors">

                    New Ticket
                  </button>
                </div>
              </motion.div>
            }
          </AnimatePresence>
        </div>
      </PageTransition>
    </GradientHero>);

}