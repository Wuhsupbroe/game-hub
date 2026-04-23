import Image from "next/image";

export default function SocialHubPage() {
  return (
    <>
      {/* Texture Overlay */}
      <div className="fixed inset-0 grain-texture z-[-1] pointer-events-none"></div>
      
      <div className="pt-8 pb-32 px-4 max-w-2xl mx-auto flex flex-col gap-8">
        {/* Main Feed Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm">hub</span>
            <span className="font-technical-code text-primary uppercase text-[10px] tracking-widest">Global Connection Active</span>
          </div>
          <h1 className="font-headline-xl text-primary-container leading-none uppercase tracking-tighter text-4xl">MEADOW_FEED // ACTIVE_SQUADS</h1>
        </div>

        {/* Card 1: Match Result */}
        <article className="glass-panel rounded-3xl p-6 shadow-[0_20px_25px_-5px_rgba(45,30,60,0.05),0_4px_6px_-2px_rgba(120,157,145,0.1)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <span className="material-symbols-outlined text-6xl">videogame_asset</span>
          </div>
          
          <div className="flex items-start gap-4 mb-6 relative">
            <div className="w-12 h-12 rounded-2xl bg-secondary-fixed border-2 border-secondary shadow-inner flex items-center justify-center">
              <span className="material-symbols-outlined text-secondary">skull</span>
            </div>
            <div className="flex flex-col">
              <h3 className="font-headline-md text-on-surface text-xl">NEON_REAPER</h3>
              <div className="flex gap-2 items-center">
                <span className="font-technical-code bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">RANK: S-ELITE</span>
                <span className="font-technical-code text-slate-400 text-[10px]">2m ago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-surface-container-highest/50 rounded-2xl p-4 mb-6 border border-white/40 shadow-inner">
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="font-label-caps text-secondary text-[10px]">MISSION STATUS</span>
                <span className="font-headline-md text-primary font-black tracking-tight text-xl">TOTAL VICTORY</span>
              </div>
              <div className="bg-primary px-3 py-1 rounded-lg shadow-lg border-b-2 border-on-primary-container">
                <span className="font-label-caps text-on-primary text-[12px]">LVL UP!</span>
              </div>
            </div>
            
            <div className="relative rounded-xl overflow-hidden aspect-video border-2 border-white/60 mb-4">
              <img 
                className="w-full h-full object-cover" 
                alt="Cinematic video game screenshot" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCX7VI0WqquUhf0yTRWrtf0UjkY_yHFdV6CWQGCCWBcoE_igVQLvPml1gqvnxcH_Zfyx9qybET4v-5-xa97Zaip8eosdynhWXt0qVwAz9FNRLj4b_JTHOA6IqU9X6nByvoYtcZW_jBDFojz0xp9YALasrva87pWyfdhkoUIRb5Xv89qKDNSir_R14vwXPxZa7N9V6Ue6DMuVz5-kR0706Fp864EZNk5-mpyCW5ygdmMyGxYL8jSWFMnDDKsDSKPOwfSoVJLCcUf6mwJ"
              />
              <div className="absolute bottom-2 left-2 flex gap-1">
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-white">network_check</span>
                  <span className="font-technical-code text-white text-[9px]">Ping: 12ms</span>
                </div>
                <div className="bg-black/60 backdrop-blur-md px-2 py-1 rounded-md flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px] text-white">group</span>
                  <span className="font-technical-code text-white text-[9px]">Squad Size: 4/5</span>
                </div>
              </div>
            </div>
            
            <p className="text-on-surface-variant font-body-sm leading-relaxed italic">
              "Clean sweep at the reactor core. Those defensive bots didn't stand a chance against the new pulse wave build."
            </p>
          </div>
          
          <div className="flex gap-3">
            <button className="chunky-button flex-1 bg-primary text-on-primary font-label-caps py-3 rounded-2xl border-on-primary-container flex items-center justify-center gap-2 shadow-lg hover:bg-primary/90 transition-colors">
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              CHEER
            </button>
            <button className="chunky-button flex-1 bg-secondary-container text-on-secondary-container font-label-caps py-3 rounded-2xl border-[#784830] flex items-center justify-center gap-2 shadow-lg hover:bg-secondary-container/90 transition-colors">
              <span className="material-symbols-outlined text-sm">person_add</span>
              JOIN SQUAD
            </button>
          </div>
        </article>

        {/* Card 2: Status Update */}
        <article className="flex flex-col gap-2 relative mt-4">
          <div className="flex items-center gap-4 pl-4">
            <div className="w-14 h-14 rounded-full bg-tertiary-fixed border-4 border-white shadow-xl overflow-hidden ring-2 ring-tertiary/20">
              <img 
                className="w-full h-full object-cover" 
                alt="Portrait of a gamer" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD9W7N4HMEbs2usb74kt-aSeBfBzxSonrNzzr27CMmQEgbMspdR2AVnUVCKxK6ejtELXz7Ow54fOeR8Q-DFMlRc2qkeNQ0m6rsXen2r2qcTP5osoybK3qS6CCx_cmbWL32KrYIQ8mEGrtPWIwt_XC8pQNSbZc9ItPPiSZFt7ZR0eVBYJdO_4Wns3kz-skj7XlVvKy6LY8g2rCOhPSZ6jBhz_EEAoLZNhuHqWtpBCQDDKP1AGk4cjU1gvcqtNwfsrom-lR83hL_FPBvy"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-on-surface leading-none text-xl">VOID_WALKER</span>
              <span className="font-technical-code text-tertiary text-[10px]">PREPARING FOR RAID...</span>
            </div>
          </div>
          
          <div className="relative glass-panel rounded-[32px] p-8 shadow-[0_15px_30px_rgba(103,75,181,0.1)] border-2 border-white/80 mt-2">
            <div className="absolute -top-3 -right-3">
              <span className="material-symbols-outlined text-tertiary-container text-4xl opacity-40">format_quote</span>
            </div>
            <p className="font-body-lg text-on-surface text-lg leading-snug">
              Just finished the neural-link calibration. Ready for the <span className="text-tertiary font-bold">S-Rank raid</span> tonight. 🌲
            </p>
            
            <div className="mt-6 pt-4 border-t border-tertiary/10 flex items-center justify-between">
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-300"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-400"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-500"></div>
                <div className="w-8 h-8 rounded-full border-2 border-white bg-tertiary flex items-center justify-center text-[10px] text-white font-bold">+12</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-tertiary transition-colors">reply</span>
                <span className="material-symbols-outlined text-slate-400 cursor-pointer hover:text-error transition-colors">favorite</span>
              </div>
            </div>
            {/* Add the little tail for the speech bubble since it's hard to do cleanly without CSS pseudo-elements in pure Tailwind sometimes, we can use an SVG or border-tricks. The original CSS had `.speech-bubble::after`. */}
            <div className="absolute -top-3 left-6 w-0 h-0 border-l-[10px] border-r-[10px] border-b-[12px] border-l-transparent border-r-transparent border-b-white/80"></div>
          </div>
        </article>

        {/* Complexity: Mini readout card */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="glass-panel rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shrink-0"></div>
            <div>
              <p className="font-label-caps text-[9px] text-slate-400 leading-none">SYSTEM STABILITY</p>
              <p className="font-technical-code text-on-surface text-xs leading-none mt-1">99.8% OPTIMAL</p>
            </div>
          </div>
          <div className="glass-panel rounded-2xl p-4 border border-white/20 flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">forest</span>
            <div>
              <p className="font-label-caps text-[9px] text-slate-400 leading-none">ZONE STATUS</p>
              <p className="font-technical-code text-on-surface text-xs leading-none mt-1">SERENE / DAY</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
