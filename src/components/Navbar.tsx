"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import Image from "next/image";

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sessionPing, setSessionPing] = useState(12);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Use the new Meadow logic for unauthenticated pages (like auth / login) vs authenticated 
  // We'll hide the standard Navbar on the login page
  if (pathname === "/login" || !user) {
    return null;
  }

  return (
    <>
      <header className="fixed top-0 w-full z-50 flex items-center px-6 h-20 bg-[#F5F2ED]/80 border-b-2 border-[#66867B] backdrop-blur-xl shadow-[0_20px_25px_-5px_rgba(45,30,60,0.05),0_4px_6px_-2px_rgba(120,157,145,0.1)]">
        <div className="flex items-center gap-4 w-full max-w-7xl mx-auto justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-fixed border-2 border-primary overflow-hidden shadow-sm relative">
              <img
                className="w-full h-full object-cover"
                src={user?.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"}
                alt="Avatar"
              />
            </div>
            <span className="text-xl font-black text-[#789D91] uppercase tracking-widest font-headline-md">MEADOW PROTOCOL</span>
          </div>
          
          <div className="flex items-center gap-6 md:flex hidden">
            <Link href="/" className={`font-label-caps transition-colors cursor-pointer ${pathname === '/' ? 'text-primary border-b-2 border-primary px-1' : 'text-slate-500 hover:text-primary'}`}>
              HUB
            </Link>
            <Link href="/squads" className={`font-label-caps transition-colors cursor-pointer ${pathname === '/squads' ? 'text-primary border-b-2 border-primary px-1' : 'text-slate-500 hover:text-primary'}`}>
              SQUADS
            </Link>
            <Link href="/market" className="font-label-caps text-slate-500 hover:text-primary transition-colors cursor-pointer">
              MARKET
            </Link>
          </div>
          
          <div className="flex items-center justify-center p-2 rounded-xl hover:bg-white/30 transition-all cursor-pointer" onClick={() => supabase.auth.signOut()}>
            <span className="material-symbols-outlined text-[#789D91]" style={{ fontVariationSettings: "'FILL' 1" }}>logout</span>
          </div>
        </div>
      </header>

      <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 bg-[#F5F2ED]/90 backdrop-blur-lg rounded-t-[32px] shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-white/30 md:hidden">
        <Link href="/" className={`flex flex-col items-center justify-center transition-all ${pathname === '/' ? 'bg-[#789D91]/20 text-teal-900 rounded-2xl px-5 py-2 border-b-2 border-[#789D91]' : 'text-slate-500 px-5 py-2 hover:scale-110'}`}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: pathname === '/' ? "'FILL' 1" : "" }}>diversity_3</span>
          <span className="font-label-caps text-[10px] uppercase font-bold tracking-tighter">Hub</span>
        </Link>
        <Link href="/chat" className={`flex flex-col items-center justify-center transition-all ${pathname === '/chat' ? 'bg-[#789D91]/20 text-teal-900 rounded-2xl px-5 py-2 border-b-2 border-[#789D91]' : 'text-slate-500 px-5 py-2 hover:scale-110'}`}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: pathname === '/chat' ? "'FILL' 1" : "" }}>groups_3</span>
          <span className="font-label-caps text-[10px] uppercase font-bold tracking-tighter">Squads</span>
        </Link>
        <Link href="/profile" className={`flex flex-col items-center justify-center transition-all ${pathname === '/profile' ? 'bg-[#789D91]/20 text-teal-900 rounded-2xl px-5 py-2 border-b-2 border-[#789D91]' : 'text-slate-500 px-5 py-2 hover:scale-110'}`}>
          <span className="material-symbols-outlined mb-1" style={{ fontVariationSettings: pathname === '/profile' ? "'FILL' 1" : "" }}>terminal</span>
          <span className="font-label-caps text-[10px] uppercase font-bold tracking-tighter">Terminal</span>
        </Link>
      </nav>
    </>
  );
}
