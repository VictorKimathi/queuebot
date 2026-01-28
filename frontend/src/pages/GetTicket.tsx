import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Printer, CheckCircle } from 'lucide-react';
import { GradientHero } from '../components/GradientHero';
import { PageTransition } from '../components/PageTransition';
export function GetTicket() {
  const [ticket, setTicket] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const generateTicket = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      const randomNum = Math.floor(Math.random() * 900) + 100;
      setTicket(`A${randomNum}`);
      setLoading(false);
    }, 1500);
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
                <p className="text-xl text-slate-400 mb-12 max-w-lg mx-auto">
                  Click the button below to generate your unique ticket number
                  and join the queue.
                </p>

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
                  {ticket}
                </div>

                <div className="bg-slate-50 rounded-xl p-6 mb-8">
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-500">Estimated Wait</span>
                    <span className="font-bold text-slate-900">~15 mins</span>
                  </div>
                  <div className="w-full h-px bg-slate-200 my-4" />
                  <div className="flex justify-between items-center text-lg">
                    <span className="text-slate-500">People Ahead</span>
                    <span className="font-bold text-slate-900">4</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link
                  to="/customer/status"
                  className="flex-1 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors">

                    View Status
                  </Link>
                  <button
                  onClick={() => setTicket(null)}
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