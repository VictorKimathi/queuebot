import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Filter, MoreVertical, Check, X, LogIn, LogOut } from 'lucide-react';
import { Sidebar } from '../components/Sidebar';
import { PageTransition } from '../components/PageTransition';
import {
  getWaitingTickets,
  getNowServing,
  callNextTicket,
  markServed as apiMarkServed,
  staffLogin,
  getStoredToken,
  storeToken,
  clearToken,
  Ticket,
} from '../api';

export function StaffDashboard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [showLogin, setShowLogin] = useState(!token);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [servedToday, setServedToday] = useState(0);

  const fetchData = async () => {
    try {
      const [nowServingRes, waitingRes] = await Promise.all([
        getNowServing(),
        getWaitingTickets(),
      ]);
      if (nowServingRes.ok) setCurrentTicket(nowServingRes.ticket);
      if (waitingRes.ok) setTickets(waitingRes.tickets);
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const result = await staffLogin(email, password);
      if (result.ok && result.token) {
        storeToken(result.token);
        setToken(result.token);
        setShowLogin(false);
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    clearToken();
    setToken(null);
    setShowLogin(true);
  };

  const callNext = async () => {
    if (!token || actionLoading) return;
    setActionLoading(true);
    try {
      const result = await callNextTicket(token);
      if (result.ok) {
        await fetchData();
        setServedToday((prev) => prev + 1);
      }
    } catch (err) {
      console.error('Failed to call next:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleMarkServed = async () => {
    if (!currentTicket || !token || actionLoading) return;
    setActionLoading(true);
    try {
      const result = await apiMarkServed(currentTicket.id, token);
      if (result.ok) {
        setServedToday((prev) => prev + 1);
        await fetchData();
      }
    } catch (err) {
      console.error('Failed to mark served:', err);
    } finally {
      setActionLoading(false);
    }
  };

  const waitingTickets = tickets;
  // Login Modal
  if (showLogin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-800 rounded-3xl p-12 max-w-md w-full border border-slate-700 shadow-2xl"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <LogIn size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Staff Login</h1>
            <p className="text-slate-400">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@example.com"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {loginError && (
              <p className="text-red-400 text-sm text-center">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-lg transition-colors"
            >
              Sign In
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

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
              <button
                onClick={handleLogout}
                className="p-2 bg-slate-800 rounded-xl border border-slate-700 hover:bg-red-500/20 hover:border-red-500/50 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
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
                        key={currentTicket?.ticket_number || 'none'}
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

                        {currentTicket?.ticket_number || '--'}
                      </motion.div>
                    </AnimatePresence>
                    <p className="text-slate-400 text-lg">
                      Ticket ID: #{currentTicket?.id || '--'}
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 w-full md:w-auto">
                    <button
                      onClick={handleMarkServed}
                      disabled={!currentTicket || actionLoading}
                      className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50">

                      <Check size={20} /> Mark Served
                    </button>
                    <button
                      onClick={callNext}
                      disabled={actionLoading || !token}
                      className="px-8 py-6 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">

                      {actionLoading ? 'Processing...' : 'Call Next Ticket'}
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
                  <p className="text-3xl font-bold text-white">{servedToday}</p>
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
                          {ticket.ticket_number}
                        </span>
                        <span className="text-xs text-slate-500">
                          {ticket.service_type}
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