"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Information } from "@/services/information";
import { X, FileText, Send, Info, Terminal } from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Information | null;
}

export default function InformationModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: Props) {
  const [form, setForm] = useState({
    title: "",
    body: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setForm({
        title: initialData.title || "",
        body: initialData.body || "",
      });
    } else if (!initialData && isOpen) {
      setForm({
        title: "",
        body: "",
      });
    }
  }, [initialData, isOpen]);

  const inputStyles = "w-full bg-white/5 border border-white/10 rounded-xl p-3 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white placeholder:text-gray-600 font-mono text-sm";
  const labelStyles = "text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2 block ml-1";

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-lg bg-[#121214] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            {/* Top Accent Line */}
            <div className="h-1.5 w-full bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.4)]" />

            <div className="p-8 md:p-10">
              {/* Header */}
              <div className="flex justify-between items-start mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Terminal size={20} className="text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black italic tracking-tighter text-white">
                      {initialData ? "EDIT_BRIEFING" : "NEW_INTEL"}
                    </h2>
                    <p className="text-gray-500 text-[10px] font-mono uppercase tracking-widest mt-1">
                      Data Entry Module // Secure_Link
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/5 rounded-xl text-gray-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label className={labelStyles}>Intel Heading</label>
                  <div className="relative">
                    <input
                      placeholder="Enter briefing title..."
                      className={inputStyles}
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <FileText size={14} className="absolute right-4 top-4 text-blue-500/30" />
                  </div>
                </div>

                <div>
                  <label className={labelStyles}>Information Payload</label>
                  <div className="relative">
                    <textarea
                      placeholder="Type Intelligence body here..."
                      className={`${inputStyles} h-40 resize-none leading-relaxed`}
                      value={form.body}
                      onChange={(e) => setForm({ ...form, body: e.target.value })}
                    />
                    <div className="absolute bottom-3 right-4">
                       <span className="text-[9px] font-mono text-gray-600 uppercase tracking-tighter">
                         Chars: {form.body.slice(0, 10)}
                       </span>
                    </div>
                  </div>
                </div>

                {/* Status Note */}
                <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                  <Info size={16} className="text-blue-500 mt-0.5" />
                  <p className="text-[10px] text-gray-500 font-mono leading-tight">
                    By submitting, you are updating the global repository. Ensure all intelligence is verified for active traders.
                  </p>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <button
                    onClick={onClose}
                    className="flex-1 text-xs font-black uppercase text-gray-500 hover:text-white transition-colors tracking-widest"
                  >
                    Discard
                  </button>

                  <button
                    onClick={() => onSubmit(form)}
                    className="flex-[2] flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl py-4 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-900/20 transition-all active:scale-95"
                  >
                    <Send size={16} />
                    {initialData ? "Apply_Updates" : "Broadcast_Intel"}
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