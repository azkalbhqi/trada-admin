"use client";

import { useEffect, useState } from "react";
import { getDashboardStats, DashboardStats } from "@/services/dashboard";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Activity, 
  BarChart3, 
  Zap, 
  TrendingUp, 
  LayoutDashboard, 
  RefreshCw, 
  Clock, 
  ChevronRight,
  ShieldCheck,
  Circle
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getDashboardStats();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-blue-500" size={40} />
          <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">Syncing_Mainframe...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <LayoutDashboard className="text-blue-500" size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight italic uppercase">TradaHub</h1>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.2em] uppercase opacity-70">Node: 0x82...f92 // System: Online</p>
          </motion.div>

          <button 
            onClick={fetchDashboard}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 text-[10px] font-black uppercase tracking-widest active:scale-95 group"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" /> 
            Refresh_Feed
          </button>
        </header>

        {/* Top Tier Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard title="Total Signals" value={data.totalSignals} icon={<BarChart3 size={20} />} color="blue" delay={0.1} />
          <StatCard title="Active Signals" value={data.activeSignals} icon={<Activity size={20} />} color="emerald" delay={0.2} />
          <StatCard title="Running Signals" value={data.runningSignals} icon={<Zap size={20} />} color="amber" delay={0.3} />
          <StatCard title="Win Rate" value={`${data.profitRate}%`} icon={<TrendingUp size={20} />} color="emerald" delay={0.4} />
        </div>

        {/* Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Intelligence Feed (Left/Middle) */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-pulse" />
                <h2 className="text-sm font-black uppercase tracking-[0.2em] italic">Intel_Briefings</h2>
              </div>
              <span className="text-[10px] font-mono text-gray-600 uppercase tracking-widest italic">Live_Streaming</span>
            </div>


            <div className="flex flex-col gap-4">
              {data.newInfos.length === 0 ? (
                <div className="p-16 border border-dashed border-white/5 rounded-[2.5rem] text-center">
                   <p className="text-gray-700 font-mono text-[10px] uppercase tracking-[0.3em]">Buffer_Empty // No Intel Logged</p>
                </div>
              ) : (
                data.newInfos.map((info, idx) => (
                  <Link href={`/information/${info.id}`} key={info.id} >
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + (idx * 0.1) }}
                    className="group relative p-6 bg-[#121214] border border-white/10 rounded-[2.2rem] hover:bg-white/[0.02] hover:border-blue-500/30 transition-all cursor-pointer shadow-xl"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-blue-500/60 font-black">REF::{info.sender || "System"}</span>
                          <h3 className="font-bold text-white tracking-tight">{info.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic font-light opacity-80 group-hover:opacity-100 transition-opacity">"{info.body}"</p>
                      </div>
                      <ChevronRight size={18} className="text-gray-800 group-hover:text-blue-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </div>
                  </motion.div>
                </Link>
                ))
              )}
            </div>
          </div>

          {/* REAL DATA Sidebar: Active Trades */}
          <div className="space-y-6">
            <div className="p-6 bg-blue-600/5 border border-blue-500/20 rounded-[2.5rem] relative overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="text-blue-500" size={16} />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                    Active_Trades
                  </h3>
                </div>
                <div className="flex items-center gap-1">
                  <Circle size={8} className="fill-blue-500 text-blue-500 animate-pulse" />
                  <span className="text-[9px] font-mono text-blue-500/40 uppercase">LIVE</span>
                </div>
              </div>

              {data.activeSignalsList?.length === 0 ? (
                <div className="py-10 text-center border border-dashed border-white/5 rounded-2xl">
                  <p className="text-gray-600 text-[10px] font-mono uppercase tracking-widest">
                    Zero Active Nodes
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {data.activeSignalsList?.map((s) => (
                    <motion.div
                      key={s.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-4 rounded-[1.5rem] bg-white/5 border border-white/10 hover:border-blue-500/40 transition-all group"
                    >
                      <div className="flex justify-between items-center mb-3">
                        {/* Symbol with a subtle 'active' glow on hover */}
                        <div className="flex flex-col">
                          <span className="font-black text-sm tracking-tighter group-hover:text-blue-400 transition-colors uppercase">
                            {s.symbol}
                          </span>
                          {/* Micro-label for system ID or similar meta */}
                          <span className="text-[7px] text-gray-700 font-mono tracking-widest uppercase -mt-1">
                            Trace_ID::{s.id}
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          {/* Status Indicator: Glowing Dot + Mono Text */}
                          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/[0.03] border border-white/5 rounded-md">
                            <div className={`w-1 h-1 rounded-full animate-pulse shadow-[0_0_5px_rgba(255,255,255,0.5)] ${
                              s.status === 'active' ? 'bg-blue-500 shadow-blue-500/50' : 
                              s.status === 'running' ? 'bg-yellow-500 shadow-yellow-500/50' : 
                              'bg-gray-500'
                            }`} />
                            <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-tighter">
                              {s.status}
                            </span>
                          </div>

                          {/* Trade Side Badge */}
                          <span
                            className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-widest border transition-all duration-300 ${
                              s.type === "long"
                                ? "text-emerald-400 border-emerald-400/20 bg-emerald-400/10 shadow-[0_0_10px_rgba(52,211,153,0.05)]"
                                : "text-rose-400 border-rose-400/20 bg-rose-400/10 shadow-[0_0_10px_rgba(251,113,133,0.05)]"
                            }`}
                          >
                            {s.type === "long" ? "▲ Buy" : "▼ Sell"}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <div className="flex flex-col">
                          <span className="text-gray-600 uppercase text-[8px]">Entry</span>
                          <span className="text-gray-300 text-sm font-bold">${s.entry_price}</span>
                        </div>
                        <div className="flex flex-col text-right">
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-gray-600 uppercase text-[8px]">Take_Profit</span>
                            <span className="text-green-600 text-sm font-bold">${s.tp_price}</span>
                          </div>
                          <div className="flex justify-between items-center gap-1">
                            <span className="text-gray-600 uppercase text-[8px]">Stop_Loss</span>
                            <span className="text-rose-400 text-sm font-bold">${s.sl_price}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, delay }: any) {
  const colors = {
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  }[color as "blue" | "emerald" | "amber"];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, borderColor: 'rgba(59,130,246,0.3)' }}
      className="p-7 bg-[#121214] border border-white/10 rounded-[2.5rem] shadow-2xl relative group overflow-hidden transition-all"
    >
      <div className={`p-3 w-fit rounded-2xl mb-6 border transition-transform group-hover:scale-110 duration-500 ${colors}`}>
        {icon}
      </div>
      <p className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
      <h2 className="text-3xl font-black tracking-tighter font-mono italic text-white group-hover:text-blue-400 transition-colors">
        {value}
      </h2>
      
      {/* HUD Corner Element */}
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
         <div className="w-12 h-12 border-t-2 border-r-2 border-white rounded-tr-xl" />
      </div>
    </motion.div>
  );
}