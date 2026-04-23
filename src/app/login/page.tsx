"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) {
        toast.error(error.message);
      }
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!email || !password) return toast.error("Provide operative details");
    
    // In Meadow, we can do login or signup here simply
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
       // if not found, let's auto sign up for this demo purpose or show error
       const { error: signUpError } = await supabase.auth.signUp({
         email, password
       });
       if(signUpError) {
          toast.error(signUpError.message);
       } else {
          toast.success("New Operative Registered. ESTABLISHED LINK.");
          router.push("/");
       }
    } else {
      toast.success("ESTABLISHED LINK.");
      router.push("/");
    }
  };

  return (
    <div className="meadow-bg min-h-screen flex items-center justify-center p-6 font-body-sm text-on-surface w-full">
      {/* Top Left System Indicator */}
      <div className="fixed top-gutter left-gutter flex flex-col gap-1 z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
          <span className="font-label-caps text-label-caps text-primary uppercase tracking-widest">Network Status: Stable</span>
        </div>
        <div className="h-[1px] w-full bg-primary/20"></div>
      </div>

      {/* Bottom Right Version Info */}
      <div className="fixed bottom-gutter right-gutter z-10">
        <span className="font-technical-code text-technical-code text-on-surface-variant/50">v4.2.0-meadow // build_8821</span>
      </div>

      <main className="w-full max-w-lg relative z-10">
        {/* Main Card */}
        <div className="glass-panel rounded-[40px] p-10 md:p-14 relative overflow-hidden">
          {/* Decorative Header Ornament */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-2 py-4">
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container"></div>
            <div className="w-24 h-[1px] bg-outline-variant/30"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container"></div>
          </div>
          
          {/* Content Area */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>energy_program_saving</span>
            </div>
            <h1 className="font-headline-xl text-headline-xl text-primary mb-2 tracking-tighter uppercase">INITIALIZE_MEADOW</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-[280px]">Welcome back, operative. Reconnect to the network.</p>
          </div>

          <form className="space-y-6" onSubmit={handleEmailSignIn}>
            {/* Social Auth */}
            <button
              onClick={handleGoogleSignIn}
              className="w-full chunky-button bg-surface-container-low hover:bg-surface-container-high border-2 border-primary-container/20 rounded-3xl py-4 flex items-center justify-center gap-3 transition-all"
              type="button"
            >
              <img
                alt="Google Logo"
                className="w-6 h-6"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG8UBAlhNAUFJX1jf7miazMsFbNzW-Y0TMRnFY2ZWI5ytJh-2j4e9x2xpI9nmM3VJHS3rAyBB_2fxw5hPQF8g1b9iv7hgMz5hbRWZablwjkAio8p3VHpWTAalmwm6iyWQug7_vOxDowcbNUnGG8Et6q80HmAssFG_cKD0Kn2fBdwDtE2jkczU9FxVT4L27aCgtiZggh6PFIid5xgN5YCPkZ1qjNXPfVj1ZPBEL4Lfm_4sp2TcM7OK0Sla4L0r9Ioj2jruv1hSF0drR"
              />
              <span className="font-label-caps text-label-caps text-on-surface-variant">Sign in with Google</span>
            </button>

            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
              <span className="font-technical-code text-[10px] text-outline uppercase tracking-widest">or direct entry</span>
              <div className="flex-1 h-[1px] bg-outline-variant/30"></div>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
              <div className="relative group">
                <label className="absolute -top-2 left-6 bg-surface px-2 font-label-caps text-[10px] text-primary z-10 border border-primary/20 rounded-full">OPERATIVE ID</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 text-lg">fingerprint</span>
                  <input
                    className="w-full sunken-input bg-surface border-2 border-transparent focus:border-primary/30 focus:ring-0 rounded-3xl py-4 pl-14 pr-6 font-technical-code text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:outline-none"
                    placeholder="MEADOW-XXXX-XXXX"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="relative group">
                <label className="absolute -top-2 left-6 bg-surface px-2 font-label-caps text-[10px] text-primary z-10 border border-primary/20 rounded-full">ACCESS CODE</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-primary/60 text-lg">key</span>
                  <input
                    className="w-full sunken-input bg-surface border-2 border-transparent focus:border-primary/30 focus:ring-0 rounded-3xl py-4 pl-14 pr-6 font-technical-code text-on-surface placeholder:text-on-surface-variant/30 transition-all focus:outline-none"
                    placeholder="••••••••"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between px-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input className="peer hidden" type="checkbox" defaultChecked />
                  <div className="w-6 h-6 border-2 border-primary/30 rounded-lg bg-surface peer-checked:bg-primary-container peer-checked:border-primary transition-all flex items-center justify-center">
                    <span className="material-symbols-outlined text-white text-sm scale-0 peer-checked:scale-100 transition-transform">check</span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant group-hover:text-primary transition-colors">Persist Session</span>
              </label>
              <a className="font-label-caps text-[10px] text-primary hover:underline underline-offset-4" href="#">Lost Protocol?</a>
            </div>

            {/* Submit Button */}
            <button
              className="w-full chunky-button bg-primary hover:bg-primary/90 rounded-3xl py-5 flex items-center justify-center gap-2 border-b-4 border-on-primary-container/20 group transition-all"
              type="submit"
            >
              <span className="font-label-caps text-label-caps text-white text-base tracking-widest leading-none mt-1">ESTABLISH_LINK</span>
              <span className="material-symbols-outlined text-white group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </form>

          {/* Decorative Accents */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* System Footer Notes */}
        <div className="mt-8 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 opacity-40">
            <span className="material-symbols-outlined text-sm">shield_lock</span>
            <span className="font-technical-code text-[10px] uppercase tracking-tighter">E2E Encrypted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-outline-variant/50"></div>
          <div className="flex items-center gap-2 opacity-40">
            <span className="material-symbols-outlined text-sm">cloud_sync</span>
            <span className="font-technical-code text-[10px] uppercase tracking-tighter">Meadow-Grid-Node-01</span>
          </div>
        </div>
      </main>

      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30">
        <div className="absolute top-20 right-[15%] w-96 h-96 border border-primary/10 rounded-full"></div>
        <div className="absolute top-40 right-[10%] w-[500px] h-[500px] border border-primary/5 rounded-full"></div>
        <div className="absolute -bottom-40 -left-20 w-[600px] h-[600px] bg-primary-container/5 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
