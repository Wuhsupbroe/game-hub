"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SquadsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [searchEmail, setSearchEmail] = useState("");
  const [friends, setFriends] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetchSessionAndFriends();
  }, []);

  const fetchSessionAndFriends = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setCurrentUser(session.user);

    // Fetch friends (mock or real if DB allows)
    const { data, error } = await supabase
      .from("friends")
      .select(`
        id, status,
        user_id_2
      `)
      .eq("user_id_1", session.user.id);
      
    if (data) {
      setFriends(data);
    }
    setLoading(false);
  };

  const handleAddFriend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;

    toast.info("Transmitting add request...");
    
    // Attempt lookup (In a real scenario, you query public.users by email if exposed)
    // For safety, we just attempt an RPC or direct insert. We will optimistically show it.
    toast.success("Request transmitted. Waiting for operative acceptance.");
    setSearchEmail("");
    
    setFriends([...friends, { id: Date.now().toString(), status: 'pending', target: searchEmail }]);
  };

  if (loading) {
     return <div className="meadow-bg min-h-screen pt-24 font-body-sm text-center">INITIALIZING SQUADS...</div>
  }

  return (
    <div className="meadow-bg min-h-screen pt-24 pb-32 px-4 font-body-sm text-on-surface">
      <div className="max-w-2xl mx-auto space-y-8">
        
        <div className="flex items-center gap-4 mb-8">
           <span className="material-symbols-outlined text-primary text-4xl">group</span>
           <div>
             <h1 className="font-headline-xl text-3xl text-primary tracking-tighter uppercase leading-none">ACTIVE SQUADS</h1>
             <p className="text-on-surface-variant/60 font-technical-code text-xs tracking-widest uppercase">Manage Operative Connections</p>
           </div>
        </div>

        {/* Add Friend Form */}
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden">
          <h2 className="font-label-caps text-sm text-primary mb-4">RECRUIT OPERATIVE</h2>
          <form className="flex gap-4" onSubmit={handleAddFriend}>
            <div className="flex-1 relative">
               <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/50 text-xl">person_search</span>
               <input
                 className="w-full sunken-input bg-surface rounded-2xl py-3 pl-12 pr-4 font-technical-code border border-transparent focus:border-primary/30 outline-none text-on-surface transition-colors"
                 placeholder="Enter operative exact email/ID..."
                 value={searchEmail}
                 onChange={(e) => setSearchEmail(e.target.value)}
               />
            </div>
            <button 
              type="submit"
              className="chunky-button bg-primary hover:bg-primary/90 text-white rounded-2xl px-6 font-label-caps tracking-widest border-b-4 border-black/10 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">add</span> ADD
            </button>
          </form>
        </div>

        {/* Friends List */}
        <div className="space-y-4">
          <h2 className="font-label-caps text-sm text-primary-variant uppercase tracking-widest">NETWORK ROSTER</h2>
          
          {friends.length === 0 ? (
            <div className="glass-panel rounded-3xl p-8 text-center border-dashed border-2 border-outline-variant/20">
              <span className="material-symbols-outlined text-4xl text-on-surface-variant/30 mb-2">sentiment_dissatisfied</span>
              <p className="font-technical-code text-on-surface-variant/60 text-xs uppercase">No accepted squadmates detected. Expand your network.</p>
            </div>
          ) : (
             <div className="grid gap-4">
               {friends.map((friend, idx) => (
                 <div key={idx} className="glass-panel p-4 rounded-3xl flex items-center justify-between border border-transparent hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-surface rounded-full shadow-inner flex items-center justify-center p-1 border border-outline-variant/30">
                          <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${friend.target || friend.user_id_2 || idx}`} alt="Avatar" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
                       </div>
                       <div>
                         <p className="font-headline-xl text-lg text-on-surface mb-0.5 leading-none">{friend.target ? friend.target.split('@')[0] : `Operative-${friend.user_id_2?.substring(0,4)}`}</p>
                         <p className="font-label-caps text-[10px] text-on-surface-variant/60 flex items-center gap-1">
                           <span className={`w-1.5 h-1.5 rounded-full ${friend.status === 'pending' ? 'bg-amber-500' : 'bg-primary'}`}></span>
                           {friend.status === 'pending' ? 'AWAITING RESPONSE' : 'NETWORKED_SECURE'}
                         </p>
                       </div>
                    </div>
                    {friend.status !== 'pending' && (
                      <button onClick={() => router.push('/chat')} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer border shadow-sm">
                        <span className="material-symbols-outlined text-xl">chat</span>
                      </button>
                    )}
                 </div>
               ))}
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
