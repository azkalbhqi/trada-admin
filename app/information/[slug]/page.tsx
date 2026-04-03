"use client";

import { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { getInfoDetail, Information } from "@/services/information";
import { 
  ChevronLeft, ShieldCheck, Cpu, Globe, Clock, Zap, Lightbulb, Database 
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function InformationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [info, setInfo] = useState<Information | null>(null);
  const [loading, setLoading] = useState(true);

  // Memoize the parser so it doesn't re-run unless info changes
  const parsedContent = useMemo(() => {
    if (!info?.body) return { alpha: "", possibility: "", suggestion: "" };

    // Splitting by the specific headers used in your data structure
    // Added .replace to clean up the 'Global Alpha: ' prefix if it exists in the first segment
    const sections = info.body.split(/\n\n(?:Possibility|Suggestion): /);
    
    return {
      alpha: sections[0].replace(/^Global Alpha: /, "").trim(),
      possibility: sections[1]?.trim() || "",
      suggestion: sections[2]?.trim() || ""
    };
  }, [info]);

  useEffect(() => {
    const fetchDetail = async () => {
      // Ensure we have a valid ID from params
      const slug = params?.slug;
      if (!slug) return;

      try {
        setLoading(true);
        const numericId = Number(Array.isArray(slug) ? slug[0] : slug);
        
        if (isNaN(numericId)) {
          setLoading(false);
          return;
        }
        
        const data = await getInfoDetail(numericId);
        setInfo(data);
      } catch (err) {
        console.error("Critical System Failure::Intel_Fetch_Failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center font-mono">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
        >
          <Cpu className="text-blue-500 mb-4" size={40} />
        </motion.div>
        <span className="text-blue-500 tracking-[0.5em] animate-pulse uppercase text-[10px]">
          Decrypting_Data_Stream...
        </span>
      </div>
    );
  }

  if (!info) {
    return (
      <div className="min-h-screen bg-[#0a0a0c] flex flex-col items-center justify-center text-white font-mono p-6 text-center">
        <h1 className="text-xl font-black mb-4 tracking-tighter text-red-500 underline decoration-red-500/30 underline-offset-8">
          ERROR::DATA_PURGED_OR_NOT_FOUND
        </h1>
        <p className="text-gray-600 text-[10px] mb-8 uppercase tracking-widest">The requested sector does not exist in the archive.</p>
        <Link href="/information" className="group text-gray-500 hover:text-white flex items-center gap-2 transition-colors border border-white/5 px-4 py-2 rounded-full">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
          Return_to_Archive
        </Link>
      </div>
    );
  }

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
            <span className="text-blue-500 animate-pulse">Secure_Connection_Established</span>
          </div>
        </motion.div>

        {/* MAIN DATA CONTAINER */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative bg-[#0d0d0f] border border-white/5 rounded-[2rem] md:rounded-[3.5rem] p-8 md:p-16 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Subtle Background Icon */}
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none text-blue-500">
            <Database size={240} />
          </div>

          {/* HEADER SECTION */}
          <header className="mb-12 relative z-10">
            <div className="flex flex-wrap items-center gap-4 mb-6">
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

            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-white leading-[1.1] uppercase">
              {info.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 mt-8 text-[11px] font-mono text-gray-500 uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Clock size={14} className="text-blue-500" /> 
                {info.created_at ? new Date(info.created_at).toLocaleDateString() : "N/A"}
              </span>
              <span className="flex items-center gap-2">
                <Globe size={14} className="text-blue-500" /> 
                Sender: <span className="text-gray-300">{info.sender || "Unknown"}</span>
              </span>
            </div>
          </header>

          {/* CONTENT ANALYSIS */}
          <div className="space-y-12 relative z-10">
            
            {/* 1. GLOBAL ALPHA (MAIN BODY) */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <Zap size={18} className="text-blue-500" />
                <h3 className="text-[11px] font-black text-blue-500 font-mono uppercase tracking-[0.3em]">
                  Global_Alpha_Analysis
                </h3>
              </div>
              <div className="relative">
                <div className="absolute -left-6 top-0 bottom-0 w-[1px] bg-gradient-to-b from-blue-600/50 via-blue-600/20 to-transparent rounded-full" />
                <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-light italic whitespace-pre-wrap">
                  {parsedContent.alpha}
                </p>
              </div>
            </section>

            {/* 2. GRID SECTION (POSSIBILITY & SUGGESTION) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* POSSIBILITY CARD */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                className="bg-white/[0.01] border border-white/5 p-8 rounded-3xl relative group transition-all hover:border-amber-500/30"
              >
                <div className="absolute top-4 right-4 text-amber-500/20 group-hover:text-amber-500/50 transition-colors">
                  <Cpu size={24} />
                </div>
                <h4 className="text-[11px] font-black text-amber-500 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  Possibility_Matrix
                </h4>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  {parsedContent.possibility || "No projection available for this node."}
                </p>
              </motion.div>

              {/* STRATEGY SUGGESTION CARD */}
              <motion.div 
                whileHover={{ y: -5, backgroundColor: "rgba(59, 130, 246, 0.05)" }}
                className="bg-blue-600/[0.02] border border-blue-500/10 p-8 rounded-3xl relative group transition-all hover:border-blue-500/40"
              >
                <div className="absolute top-4 right-4 text-blue-500/20 group-hover:text-blue-500/50 transition-colors">
                  <Lightbulb size={24} />
                </div>
                <h4 className="text-[11px] font-black text-blue-400 font-mono uppercase tracking-widest mb-4 flex items-center gap-2">
                  Strategy_Suggestion
                </h4>
                <p className="text-gray-400 text-sm md:text-base leading-relaxed font-light">
                  {parsedContent.suggestion || "Awaiting tactical input..."}
                </p>
              </motion.div>

            </div>
          </div>

          {/* FOOTER DECORATION */}
          <footer className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-700 font-mono text-[9px] uppercase tracking-[0.4em]">
            <span>Digital_Hash: 0x{info.id?.toString(16).padStart(3, '0')}...{Math.random().toString(36).substring(7).toUpperCase()}</span>
            <div className="flex items-center gap-4">
              <span className="animate-pulse text-emerald-900">Uplink_Active</span>
              <span className="opacity-50">Encrypted_v2.4_TLS</span>
            </div>
          </footer>
        </motion.div>

        {/* END OF FILE INDICATOR */}
        <div className="mt-12 text-center pb-12">
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