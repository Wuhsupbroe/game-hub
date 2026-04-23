"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function SocialHubPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [isScheduling, setIsScheduling] = useState(false);
  const [newGame, setNewGame] = useState("");
  const [newTime, setNewTime] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchData();
    
    // Subscribe to new sessions
    const sub = supabase.channel('public:sessions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sessions' }, payload => {
         setSessions(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(sub); }
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);

    try {
      const { data, error } = await supabase
        .from("sessions")
        .select('*')
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data && data.length > 0) {
        setSessions(data);
      } else {
        // Fallback to sample data to preserve UI preview
        setSessions([{
          id: 'mock-1',
          game_name: 'Helldivers 2',
          status: 'TOTAL VICTORY',
          note: "Clean sweep at the reactor core. Those defensive bots didn't stand a chance against the new pulse wave build.",
          time_scheduled: new Date().toISOString(),
          host: 'NEON_REAPER'
        }]);
      }
    } catch(e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGame || !newTime) return;

    setIsScheduling(false);
    toast.success("Deployment scheduled successfully!");

    const newSession = {
      game_name: newGame,
      time_scheduled: new Date(newTime).toISOString(),
      host: user?.email?.split('@')[0] || "Operative",
      status: "UPCOMING",
      note: "Awaiting squard deployment."
    };

    // Optimistic Update
    setSessions([newSession, ...sessions]);

    // Send to DB
    await supabase.from("sessions").insert([newSession]);
    setNewGame("");
    setNewTime("");
  };

  if (loading) return null;

  return (
    <>
      <div className="fixed inset-0 grain-texture z-[-1] pointer-events-none"></div>
      
      <div className="pt-24 pb-32 px-4 max-w-2xl mx-auto flex flex-col gap-8">
        {/* Header & Quick Action */}
        <div className="flex items-end justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-sm">hub</span>
              <span className="font-technical-code text-primary uppercase text-[10px] tracking-widest">Global Connection Active</span>
            </div>
            <h1 className="font-headline-xl text-primary-container leading-none uppercase tracking-tighter text-4xl">MEADOW_FEED</h1>
          </div>
          <button 
            onClick={() => setIsScheduling(!isScheduling)}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined">{isScheduling ? 'close' : 'add'}</span>
          </button>
        </div>

        {/* Schedule Form */}
        {isScheduling && (
          <div className="glass-panel p-6 rounded-3xl animate-in slide-in-from-top-4 fade-in duration-300 border-2 border-primary/20">
            <h2 className="font-label-caps text-sm text-primary mb-4 flex items-center gap-2">
               <span className="material-symbols-outlined text-base">calendar_month</span> SCHEDULE DEPLOYMENT
            </h2>
            <form className="flex flex-col gap-4" onSubmit={handleScheduleSubmit}>
              <input
                className="w-full sunken-input bg-surface rounded-2xl py-3 px-4 font-technical-code border border-transparent focus:border-primary/30 outline-none text-on-surface"
                placeholder="Game Name (e.g., Helldivers 2)"
                value={newGame}
                onChange={(e) => setNewGame(e.target.value)}
              />
              <input
                type="datetime-local"
                className="w-full sunken-input bg-surface rounded-2xl py-3 px-4 font-technical-code border border-transparent focus:border-primary/30 outline-none text-on-surface"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
              />
              <button type="submit" className="chunky-button mt-2 bg-primary text-white py-3 rounded-2xl font-label-caps tracking-widest shadow flex justify-center gap-2">
                 <span className="material-symbols-outlined text-sm">rocket_launch</span> DEPLOY
              </button>
            </form>
          </div>
        )}

        {/* Dynamic Feed */}
        <div className="flex flex-col gap-8">
          {sessions.map((session, idx) => (
            <article key={idx} className="glass-panel rounded-3xl p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <span className="material-symbols-outlined text-6xl">{session.status === 'UPCOMING' ? 'schedule' : 'videogame_asset'}</span>
              </div>
              
              <div className="flex items-start gap-4 mb-6 relative">
                <div className={`w-12 h-12 rounded-2xl border-2 shadow-inner flex items-center justify-center ${session.status === 'UPCOMING' ? 'bg-primary-container/20 border-primary' : 'bg-secondary-fixed border-secondary'}`}>
                  <span className={`material-symbols-outlined ${session.status === 'UPCOMING' ? 'text-primary' : 'text-secondary'}`}>
                    {session.status === 'UPCOMING' ? 'event' : 'skull'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-headline-md text-on-surface text-xl">{session.host || 'OPERATIVE'}</h3>
                  <div className="flex gap-2 items-center mt-1">
                    <span className={`font-technical-code text-[10px] px-2 py-0.5 rounded-full ${session.status === 'UPCOMING' ? 'bg-tertiary/10 text-tertiary' : 'bg-primary/10 text-primary'}`}>
                      {session.game_name}
                    </span>
                    <span className="font-technical-code text-slate-400 text-[10px]">
                      {new Date(session.time_scheduled).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="bg-surface-container-highest/50 rounded-2xl p-4 mb-6 border border-white/40 shadow-inner">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex flex-col">
                    <span className="font-label-caps text-secondary text-[10px]">MISSION STATUS</span>
                    <span className={`font-headline-md font-black tracking-tight text-xl ${session.status === 'UPCOMING' ? 'text-tertiary' : 'text-primary'}`}>
                      {session.status || 'DEPLOYED'}
                    </span>
                  </div>
                </div>
                
                <p className="text-on-surface-variant font-body-sm leading-relaxed italic">
                  "{session.note || 'Awaiting squard deployment.'}"
                </p>
              </div>
              
              <div className="flex gap-3">
                <button className="chunky-button flex-1 bg-primary text-on-primary font-label-caps py-3 rounded-2xl border-on-primary-container flex items-center justify-center gap-2 shadow-sm hover:bg-primary/90 transition-colors">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
                  CHEER
                </button>
                <button className="chunky-button flex-1 bg-secondary-container text-on-secondary-container font-label-caps py-3 rounded-2xl border-[#784830] flex items-center justify-center gap-2 shadow-sm hover:bg-secondary-container/90 transition-colors">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  JOIN SQUAD
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Readouts */}
        <div className="grid grid-cols-2 gap-4 mt-2">
          <div className="glass-panel rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
            <div>
              <p className="font-label-caps text-[9px] text-slate-400 leading-none">SYSTEM STABILITY</p>
              <p className="font-technical-code text-on-surface text-xs leading-none mt-1">99.8% OPTIMAL</p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">network_ping</span>
            <div>
              <p className="font-label-caps text-[9px] text-slate-400 leading-none">GLOBAL PING</p>
              <p className="font-technical-code text-on-surface text-xs leading-none mt-1">12ms - USEAST</p>
            </div>
          </div>
        </div>

      </div>
    </>
  );
}
