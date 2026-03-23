"use client";

import { useEffect, useState } from "react";
import {
  getSignals,
  createSignal,
  updateSignal,
  deleteSignal,
  Signal,
} from "@/services/signal";
import SignalModal from "@/app/components/SignalModal";
import { Plus, Edit2, Trash2, RefreshCw, BarChart3, Clock } from "lucide-react";
import { motion } from "framer-motion";
import Swal from "sweetalert2";

export default function SignalPage() {
  const [signals, setSignals] = useState<Signal[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<Signal | null>(null);

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const data = await getSignals();
      setSignals(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  // --- HANDLERS ---

  const handleSubmit = async (data: any) => {
    try {
      if (selectedSignal) {
        await updateSignal(selectedSignal.id, data);
        Swal.fire({ title: "Updated!", icon: "success", timer: 1000, showConfirmButton: false });
      } else {
        await createSignal(data);
        Swal.fire({ title: "Created!", icon: "success", timer: 1000, showConfirmButton: false });
      }

      setIsOpen(false);
      setSelectedSignal(null);
      fetchSignals();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Transaction failed to execute", "error");
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Delete Signal?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete",
      background: "#121214",
      color: "#fff"
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSignal(id);
      await Swal.fire({ title: "Deleted!", icon: "success", timer: 1200, showConfirmButton: false });
      fetchSignals();
    } catch (err) {
      Swal.fire("Error", "Failed to delete signal", "error");
    }
  };

  const getStatusStyle = (status: Signal['status']) => {
    switch (status) {
      case 'profit': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'loss': return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
      case 'cancelled': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30 animate-pulse';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="text-blue-500" size={24} />
              <h1 className="text-3xl font-black tracking-tight italic">TERMINAL_v2</h1>
            </div>
            <p className="text-gray-500 text-xs font-mono uppercase tracking-widest">Live Signal Feed</p>
          </div>

          <div className="flex gap-3">
            <button onClick={fetchSignals} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
            </button>
            <button 
              onClick={() => { setSelectedSignal(null); setIsOpen(true); }} 
              className="bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
            >
              <Plus size={18} /> New Signal
            </button>
          </div>
        </header>

        {/* Enhanced Table */}
        <div className="bg-[#121214] border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Meta / Date</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Asset & Side</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-5 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Config</th>
                  <th className="px-6 py-5 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {signals.map((s) => (
                  <motion.tr key={s.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-[10px] font-mono font-bold text-blue-500/50">ID_{s.id}</span>
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono">
                          <Clock size={12} />
                          {s.created_at ? new Date(s.created_at).toLocaleDateString() : '---'}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-black text-lg tracking-tighter text-white">{s.symbol}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${s.type === 'long' ? 'text-emerald-500' : 'text-rose-500'}`}>
                          {s.type === 'long' ? '▲ Long' : '▼ Short'}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase border ${getStatusStyle(s.status)}`}>
                        {s.status}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4 font-mono">
                        <div>
                          <p className="text-[9px] text-gray-600 font-black uppercase">Ent</p>
                          <p className="text-sm text-gray-300">${s.entry_price}</p>
                        </div>
                        <div className="h-6 w-[1px] bg-white/5" />
                        <div>
                          <p className="text-[9px] text-rose-500/50 font-black uppercase">SL</p>
                          <p className="text-sm text-rose-400/80">${s.sl_price}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-emerald-500/50 font-black uppercase">TP</p>
                          <p className="text-sm text-emerald-400/80">${s.tp_price || '---'}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-0 translate-x-2">
                        <button 
                          onClick={() => { setSelectedSignal(s); setIsOpen(true); }} 
                          className="p-2.5 hover:bg-blue-500/10 text-blue-400 rounded-xl transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)} 
                          className="p-2.5 hover:bg-rose-500/10 text-rose-400 rounded-xl transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <SignalModal 
        isOpen={isOpen} 
        onClose={() => { setIsOpen(false); setSelectedSignal(null); }} 
        onSubmit={handleSubmit} 
        initialData={selectedSignal} 
      />
    </div>
  );
}