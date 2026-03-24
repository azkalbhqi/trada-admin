"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS } from "./navlinks";
import { Menu, X, Cpu, Activity } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Disable scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
  }, [isOpen]);

  return (
    <>
      {/* OVERLAY */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* SIDEBAR */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          fixed top-0 left-0 h-screen w-72 bg-[#0d0d0f] border-r border-white/5 
          text-white p-6 flex flex-col z-50
          transform transition-all duration-500 ease-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* LOGO */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <Cpu size={22} className="text-blue-500 animate-pulse" />
              <span className="text-2xl font-black italic tracking-tighter">
                TRADA
              </span>
            </div>
            <span className="text-[9px] font-mono text-gray-600 uppercase tracking-[0.3em] mt-1 ml-1">
              Mainframe_Access
            </span>
          </div>

          {/* Close mobile */}
          <button
            className="md:hidden p-2 hover:bg-white/5 rounded-full transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-3">
          <p className="text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2 ml-4">
            Navigation_Menu
          </p>

          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.path;

            return (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className="relative group outline-none"
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 bg-blue-600/10 border border-blue-500/30 rounded-2xl"
                  />
                )}

                <div
                  className={`
                    relative z-10 px-5 py-3 rounded-2xl flex items-center justify-between
                    transition-all duration-300
                    ${
                      isActive
                        ? "text-blue-400"
                        : "text-gray-500 hover:text-white hover:bg-white/[0.02]"
                    }
                  `}
                >
                  <span
                    className={`text-xs font-black uppercase tracking-widest ${
                      isActive ? "opacity-100" : "opacity-50"
                    }`}
                  >
                    {link.name}
                  </span>

                  {isActive && (
                    <Activity size={14} className="text-blue-500" />
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* FOOTER */}
        <div className="mt-auto px-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white tracking-widest">
              © 2026
            </span>
            <span className="text-[8px] font-mono text-gray-700 uppercase">
              Ver_2.4.0_Stable
            </span>
          </div>
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        </div>
      </div>

      {/* FLOATING MOBILE MENU BUTTON */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className={`md:hidden relative left-20 z-50 transition ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-12 h-12 bg-[#0d0d0f] border border-white/10 rounded-xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          {/* Glow */}
          <div className="absolute inset-0 bg-blue-500/10 blur-xl group-hover:bg-blue-500/20 transition-all rounded-xl" />

          {/* Icon */}
          <div className="relative flex items-center gap-1">
            <span className="text-blue-500 font-mono text-xs font-bold">
              {">_"}
            </span>
            <Menu size={20} className="text-white" />
          </div>

          {/* Corner accents */}
          <div className="absolute -top-1 -right-1 w-2 h-2 border-t border-r border-blue-500" />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 border-b border-l border-blue-500" />
        </button>
      </motion.div>
    </>
  );
}