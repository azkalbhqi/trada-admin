"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInfoDetail, Information } from "@/services/information";
import { 
  ChevronLeft, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  Clock,
  Zap,
  Lightbulb,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InformationDetailPage() {
  const { slug } = useParams();
  const id = slug; // Assuming slug is the ID for simplicity, adjust as needed
  const router = useRouter();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  // Fungsi Parser untuk memecah string panjang menjadi bagian terstruktur
  const parsePayload = (text: string) => {
    if (!text) return { alpha: "", possibility: "", suggestion: "" };

    // Regex untuk mencari separator "Possibility:" dan "Suggestion:"
    const sections = text.split(/\\n\\n(?:Possibility|Suggestion): /);
    
    return {
      alpha: sections[0].replace("Global Alpha: ", "").trim(),
      possibility: sections[1]?.trim() || "",
      suggestion: sections[2]?.trim() || ""
    };
  };

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const numericId = Number(id);
        if (isNaN(numericId)) return;
        
        const data = await getInfoDetail(numericId);
        setInfo(data);
      } catch (err) {
        console.error("Failed to fetch intel:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center font-mono">
        <Cpu className="text-blue-500 animate-spin mb-4" size={40} />
        <span className="text-blue-500 tracking-[0.5em] animate-pulse uppercase text-[10px]">
          Decrypting_Data_Stream...
        </span>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-white font-mono">
        <h1 className="text-xl font-black mb-4 tracking-tighter text-red-500">ERROR::DATA_PURGED_OR_NOT_FOUND</h1>
        <Link href="/information" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors">
          <ChevronLeft size={20} /> Return_to_Archive
        </Link>
      </div>
    );
  }

  const { alpha, possibility, suggestion } = parsePayload(info.body || "");

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <div className="max-w-5xl mx-auto">
        
        {/* TOP NAVIGATION BAR */}
        <motion.div 
          initial={{ opacity: 0, y: -10 }} 
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-10"
        >
          <button 
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-gray-500 hover:text-white transition-colors font-mono text-[10px] uppercase tracking-[0.2em]"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back_to_Archive
          </button>
          
          <div className="hidden md:flex items-center gap-4 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Clock size={12} /> {new Date().toLocaleTimeString()}</span>
            <span className="w-1 h-1 bg-gray-800 rounded-full" />
            <span className="text-blue-500">Secure_Connection_Established</span>
          </div>
        </motion.div>

        {/* MAIN DATA CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.99 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-[#0d0d0f] border border-white/5 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-2xl overflow-hidden"
        >
          {/* Subtle Background Icon */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none text-blue-500">
            <Database size={240} />
          </div>

          {/* HEADER SECTION */}
          <header className="mb-12">
            <div className="flex items-center gap-4 mb-6">
              <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
                <span className="text-[10px] font-black text-blue-500 font-mono tracking-widest uppercase">
                  Intel_ID::{info.id}
                </span>
              </div>
              <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md flex items-center gap-2">
                <ShieldCheck size={12} className="text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 font-mono uppercase">Lvl_3_Access</span>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-tight uppercase">
              {info.title}
            </h1>
            
            <div className="flex items-center gap-6 mt-6 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Clock size={14} className="text-blue-500" /> {info.created_at?.split('T')[0]}</span>
              <span className="flex items-center gap-2"><Globe size={14} className="text-blue-500" /> Sender: {info.sender || "Unknown Sender"}</span>
            </div>
          </header>

          {/* CONTENT ANALYSIS */}
          <div className="space-y-12 relative z-10">
            
            {/* 1. GLOBAL ALPHA (MAIN BODY) */}
            <section>
              <div className="flex items-center gap-3 mb-4">
                <Zap size={18} className="text-blue-500" />
                <h3 className="text-[11px] font-black text-blue-500 font-mono uppercase tracking-[0.3em]">
                  Global_Alpha_Analysis
                </h3>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-600/50 to-transparent rounded-full" />
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light italic whitespace-pre-wrap">
                  {alpha}
                </p>
              </div>
            </section>

            {/* 2. GRID SECTION (POSSIBILITY & SUGGESTION) */}
            <div className="flex flex-col gap-8">
              
              {/* POSSIBILITY CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl relative group transition-all hover:border-amber-500/30"
              >
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-500/10 border border-amber-500/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Cpu size={14} className="text-amber-500" />
                </div>
                <h4 className="text-[11px] font-black text-amber-500 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  Possibility_Matrix
                </h4>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  {possibility || "No projection available for this node."}
                </p>
              </motion.div>

              {/* STRATEGY SUGGESTION CARD */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-blue-600/[0.03] border border-blue-500/10 p-8 rounded-3xl relative group transition-all hover:border-blue-500/40"
              >
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500/10 border border-blue-500/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Lightbulb size={14} className="text-blue-500" />
                </div>
                <h4 className="text-[11px] font-black text-blue-400 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  Strategy_Suggestion
                </h4>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  {suggestion || "Awaiting tactical input..."}
                </p>
              </motion.div>

            </div>
          </div>

          {/* FOOTER DECORATION */}
          <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-700 font-mono text-[9px] uppercase tracking-[0.4em]">
            <span>Digital_Hash: 0x821...FA92</span>
            <div className="flex items-center gap-4">
              <span className="animate-pulse text-emerald-900">Uplink_Active</span>
              <span>Encrypted_v2.4</span>
            </div>
          </footer>
        </motion.div>

        {/* END OF FILE INDICATOR */}
        <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-4">
                <div className="h-[1px] w-12 bg-gray-900" />
                <span className="text-[10px] font-mono text-gray-800 uppercase tracking-widest">End_of_Transmission</span>
                <div className="h-[1px] w-12 bg-gray-900" />
            </div>
        </div>
      </div>
    </div>
  );
}