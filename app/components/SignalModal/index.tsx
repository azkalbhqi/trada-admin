"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Signal } from "@/services/signal";
import {
  X,
  TrendingUp,
  TrendingDown,
  Target,
  ShieldAlert,
  Zap,
  Activity,
  Loader2,
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: Signal | null;
}

export default function SignalModal({ isOpen, onClose, onSubmit, initialData }: Props) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    symbol: "",
    type: "long" as "long" | "short",
    status: "active" as "active" | "running" | "cancelled" | "profit" | "loss",
    entry_price: "",
    sl_price: "",
    tp_price: "",
    sender_id: "",
  });

  // Calculate Risk/Reward Ratio on the fly
  const rrRatio = useMemo(() => {
    const entry = parseFloat(form.entry_price);
    const sl = parseFloat(form.sl_price);
    const tp = parseFloat(form.tp_price);

    if (!entry || !sl || !tp) return null;

    const risk = Math.abs(entry - sl);
    const reward = Math.abs(tp - entry);
    return (reward / risk).toFixed(2);
  }, [form.entry_price, form.sl_price, form.tp_price]);

  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        symbol: initialData.symbol || "",
        type: initialData.type || "long",
        status: initialData.status || "active",
        entry_price: initialData.entry_price?.toString() || "",
        sl_price: initialData.sl_price?.toString() || "",
        tp_price: initialData.tp_price?.toString() || "",
        sender_id: initialData.sender_id || "",
      });
    } else if (!initialData && isOpen) {
      setForm({
        symbol: "",
        type: "long",
        status: "active",
        entry_price: "",
        sl_price: "",
        tp_price: "",
        sender_id: "",
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // We pass the form data back. 
      // If parent needs the ID, it should handle it via the initialData reference it already has.
      await onSubmit(form);
      onClose();
    } catch (err) {
      console.error("Submission Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-gray-600 font-mono text-sm";
  const labelStyles = "text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#121214] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className={`h-1.5 w-full transition-colors duration-500 ${form.type === "long" ? "bg-emerald-500" : "bg-rose-500"}`} />

            <div className="p-8 md:p-10">
              {/* HEADER */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black italic tracking-tighter text-white">
                    {initialData ? "UPDATE_SIGNAL" : "INIT_SIGNAL"}
                  </h2>
                  <p className="text-gray-500 text-xs font-mono mt-1">
                    {initialData ? `MOD_ID: ${initialData.id}` : "CORE_SYSTEM_READY"}
                  </p>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* ASSET + SIDE */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelStyles}>Asset</label>
                    <div className="relative">
                      <input
                        className={inputStyles}
                        placeholder="BTCUSDT"
                        value={form.symbol}
                        onChange={(e) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
                      />
                      <Zap size={14} className="absolute right-4 top-4 text-blue-500/30" />
                    </div>
                  </div>

                  <div>
                    <label className={labelStyles}>Side</label>
                    <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                      <button
                        onClick={() => setForm({ ...form, type: "long" })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${form.type === "long" ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <TrendingUp size={14} /> Buy
                      </button>
                      <button
                        onClick={() => setForm({ ...form, type: "short" })}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${form.type === "short" ? "bg-rose-600 text-white shadow-lg shadow-rose-600/20" : "text-gray-500 hover:text-gray-300"}`}
                      >
                        <TrendingDown size={14} /> Sell
                      </button>
                    </div>
                  </div>
                </div>

                {/* STATUS SELECTOR */}
                <div>
                  <label className={labelStyles}>Lifecycle Status</label>
                  <div className="grid grid-cols-4 gap-2">
                    {["active", "cancelled", "profit", "loss"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setForm({ ...form, status: s as any })}
                        className={`py-2 text-[10px] font-black uppercase rounded-lg border transition-all ${
                          form.status === s ? "bg-blue-600 border-blue-500 text-white" : "text-gray-500 border-white/5 hover:border-white/20"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* PRICES */}
                <div className="space-y-4">
                  <div>
                    <label className={labelStyles}>Entry Price</label>
                    <input
                      type="number"
                      className={inputStyles}
                      placeholder="0.00"
                      value={form.entry_price}
                      onChange={(e) => setForm({ ...form, entry_price: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={labelStyles}><ShieldAlert size={10} className="inline mr-1" /> Stop Loss</label>
                      <input
                        type="number"
                        placeholder="SL"
                        className={`${inputStyles} border-rose-500/10 focus:ring-rose-500/20`}
                        value={form.sl_price}
                        onChange={(e) => setForm({ ...form, sl_price: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className={labelStyles}><Target size={10} className="inline mr-1" /> Take Profit</label>
                      <input
                        type="number"
                        placeholder="TP"
                        className={`${inputStyles} border-emerald-500/10 focus:ring-emerald-500/20`}
                        value={form.tp_price}
                        onChange={(e) => setForm({ ...form, tp_price: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* RR RATIO DISPLAY */}
                {rrRatio && (
                   <div className="bg-blue-500/5 border border-blue-500/10 rounded-xl p-3 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Risk/Reward Ratio</span>
                      <span className="font-mono font-bold text-blue-400">{rrRatio}x</span>
                   </div>
                )}

                {/* ACTION BUTTONS */}
                <div className="flex items-center gap-4 pt-4">
                  <button onClick={onClose} className="flex-1 text-xs font-bold uppercase text-gray-500 hover:text-white transition-colors tracking-widest">
                    Abort
                  </button>

                  <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:opacity-50 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Activity size={16} />}
                    {initialData ? "Apply_Changes" : "Transmit_Signal"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}