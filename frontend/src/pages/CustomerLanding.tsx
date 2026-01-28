import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Ticket, Users } from 'lucide-react';
import { GradientHero } from '../components/GradientHero';
import { PageTransition } from '../components/PageTransition';
export function CustomerLanding() {
  return (
    <GradientHero className="flex items-center justify-center p-6">
      <PageTransition className="max-w-5xl mx-auto text-center">
        <motion.div
          initial={{
            scale: 0.9,
            opacity: 0
          }}
          animate={{
            scale: 1,
            opacity: 1
          }}
          transition={{
            duration: 0.5
          }}
          className="mb-16">

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Welcome to Queue
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
            Experience the future of waiting. Get your ticket or check your
            status below.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link to="/customer/new" className="group">
            <motion.div
              whileHover={{
                y: -10
              }}
              className="h-full bg-orange-500 rounded-3xl p-10 text-left shadow-dramatic relative overflow-hidden">

              <div className="absolute top-0 right-0 p-8 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <Ticket size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center mb-8">
                  <Ticket className="text-white" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Get Ticket
                </h2>
                <p className="text-orange-100 text-lg mb-8">
                  Join the queue and secure your spot in line instantly.
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-lg group-hover:gap-4 transition-all">
                  Start Now <ArrowRight />
                </div>
              </div>
            </motion.div>
          </Link>

          <Link to="/customer/status" className="group">
            <motion.div
              whileHover={{
                y: -10
              }}
              className="h-full bg-slate-800/50 backdrop-blur border border-white/10 rounded-3xl p-10 text-left shadow-xl relative overflow-hidden hover:bg-slate-800/70 transition-colors">

              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <Users size={200} />
              </div>
              <div className="relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8">
                  <Users className="text-white" size={32} />
                </div>
                <h2 className="text-4xl font-bold text-white mb-4">
                  Check Status
                </h2>
                <p className="text-slate-400 text-lg mb-8">
                  Already have a ticket? See where you are in the queue.
                </p>
                <div className="flex items-center gap-2 text-white font-bold text-lg group-hover:gap-4 transition-all">
                  View Status <ArrowRight />
                </div>
              </div>
            </motion.div>
          </Link>
        </div>
      </PageTransition>
    </GradientHero>);

}