"use client";

import { useEffect, useState } from "react";
import {
  getAllInfos,
  createInfo,
  updateInfo,
  getInfoDetail,
  deleteInfo, // ✅ Service added
  Information,
} from "@/services/information";
import InformationModal from "@/app/components/InformationModal";
import { Plus, Eye, RefreshCw, Database, Search, Calendar, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function InformationPage() {
  const [infos, setInfos] = useState<Information[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState<Information | null>(null);

  const fetchInfos = async () => {
    try {
      setLoading(true);
      const data = await getAllInfos();
      setInfos(data);
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  // --- HANDLERS ---

  const handleCreate = () => {
    setSelectedInfo(null);
    setIsOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      const data = await getInfoDetail(id);
      setSelectedInfo(data);
      setIsOpen(true);
    } catch (err) {
      Swal.fire({ icon: "error", title: "Access Denied", background: '#121214', color: '#fff' });
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      if (selectedInfo) {
        await updateInfo(selectedInfo.id, data);
        Swal.fire({ title: "Intel Updated", icon: "success", timer: 1000, showConfirmButton: false, background: '#121214', color: '#fff' });
      } else {
        await createInfo(data);
        Swal.fire({ title: "Intel Broadcasted", icon: "success", timer: 1000, showConfirmButton: false, background: '#121214', color: '#fff' });
      }
      setIsOpen(false);
      setSelectedInfo(null);
      fetchInfos();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Transmission Failed", background: '#121214', color: '#fff' });
    }
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Wipe Intel?",
      text: "This record will be purged from the archive.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#3f3f46",
      confirmButtonText: "Purge",
      background: "#121214",
      color: "#fff",
      customClass: {
        popup: 'rounded-[2rem] border border-white/10'
      }
    });

    if (!result.isConfirmed) return;

    try {
      await deleteInfo(id);
      await Swal.fire({ title: "Purged", icon: "success", timer: 1000, showConfirmButton: false, background: '#121214', color: '#fff' });
      fetchInfos();
    } catch (err) {
      Swal.fire({ icon: "error", title: "Purge Failed", background: '#121214', color: '#fff' });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]">
                <Database className="text-blue-500" size={24} />
              </div>
              <h1 className="text-3xl font-black tracking-tight italic uppercase text-white">Intel_Archive</h1>
            </div>
            <p className="text-gray-500 text-xs font-mono tracking-[0.2em] uppercase opacity-70 ml-1">KNOWLEDGE_IS_POWER</p>
          </motion.div>

          <div className="flex items-center gap-3">
            <button 
              onClick={fetchInfos}
              className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-gray-400 active:scale-90"
            >
              <RefreshCw size={18} className={loading ? "animate-spin text-blue-500" : ""} />
            </button>
            <button
              onClick={handleCreate}
              className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2 active:scale-95"
            >
              <Plus size={16} /> New_Entry
            </button>
          </div>
        </header>

        {/* Info Table Container */}
        <div className="bg-[#121214] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.01]">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Ref_Title</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Payload_Preview</th>
                  <th className="px-8 py-6 text-right text-[10px] font-black text-gray-500 uppercase tracking-[0.3em]">Command</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <AnimatePresence mode="popLayout">
                {loading ? (
                  <tr key="loading"><td colSpan={3} className="py-32 text-center text-xs font-mono text-gray-600 animate-pulse tracking-[0.4em]">Syncing_Archive...</td></tr>
                ) : infos.length === 0 ? (
                  <tr key="empty"><td colSpan={3} className="py-32 text-center text-gray-600 font-mono text-[10px] uppercase tracking-widest">No intelligence found.</td></tr>
                ) : (
                  infos.map((info, idx) => (
                    <motion.tr 
                      key={info.id} 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                      className="group hover:bg-white/[0.02] transition-all"
                    >
                      <td className="px-8 py-7">
                        <div className="flex flex-col gap-1.5">
                          <span className="text-white font-bold text-lg tracking-tight group-hover:text-blue-400 transition-colors">{info.title}</span>
                          <div className="flex items-center gap-3 text-[10px] text-gray-600 font-mono">
                            <span className="text-blue-500/60 font-black">REF::{info.id}</span>
                            <span className="flex items-center gap-1.5 uppercase"><Calendar size={12} /> {info.created_at?.substring(0, 10)}</span>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-8 py-7">
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 max-w-lg font-light italic border-l border-white/5 pl-4 group-hover:border-blue-500/30 transition-colors">
                          {info.body || "Empty Data Payload."}
                        </p>
                      </td>

                      <td className="px-8 py-7 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                          <button 
                            onClick={() => handleEdit(info.id)} 
                            className="p-2.5 bg-white/5 hover:bg-blue-600/10 border border-white/5 hover:border-blue-500/30 text-blue-400 rounded-xl transition-all"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={() => handleDelete(info.id)} 
                            className="p-2.5 bg-white/5 hover:bg-rose-600/10 border border-white/5 hover:border-rose-500/30 text-rose-500 rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex justify-between items-center px-6">
          <p className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.3em]">Vault_Count: {infos.length}</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Uplink_Live</span>
          </div>
        </div>
      </div>

      <InformationModal
        isOpen={isOpen}
        onClose={() => { setIsOpen(false); setSelectedInfo(null); }}
        onSubmit={handleSubmit}
        initialData={selectedInfo}
      />
    </div>
  );
}