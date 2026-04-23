"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Message = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  users?: {
    display_name: string;
    profile_picture_url: string;
  };
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    setUser(session.user);

    // 1. Fetch historical messages
    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          id, content, created_at, user_id,
          users (display_name, profile_picture_url)
        `)
        .order('created_at', { ascending: true })
        .limit(50);
        
      if (error) throw error;
      if (data && data.length > 0) {
        setMessages(data as any);
      } else {
        fallbackMockMessages(session.user.id);
      }
    } catch (err) {
      fallbackMockMessages(session.user.id);
    }

    // 2. Subscribe to real-time events
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        if (newMsg.user_id !== session.user.id) {
           setMessages(prev => [...prev, newMsg]);
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setIsConnected(true);
        } else if (status === 'CHANNEL_ERROR') {
          setIsConnected(false);
        }
      });

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  };

  const fallbackMockMessages = (uid: string) => {
    setMessages([
      { id: '1', user_id: 'other', content: 'Ready for the 8PM deployment?', created_at: new Date(Date.now() - 3600000).toISOString(), users: { display_name: 'Player 2', profile_picture_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=P2' } },
      { id: '2', user_id: uid, content: 'Network stable. Waiting in lobby.', created_at: new Date(Date.now() - 3000000).toISOString(), users: { display_name: 'Player 1', profile_picture_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Player1' } },
    ]);
  };

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const payloadContent = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      user_id: user.id,
      content: payloadContent,
      created_at: new Date().toISOString(),
      users: {
        display_name: 'Player 1',
        profile_picture_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Player1'
      }
    };
    
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ content: payloadContent, user_id: user.id }]);
        
      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error("Failed to transmit to network.");
    }
  };

  if (!user) return <div className="meadow-bg min-h-screen pt-24 font-body-sm text-center">INITIALIZING COMMS...</div>;

  return (
    <div className="meadow-bg min-h-screen pt-24 pb-32 px-4 font-body-sm text-on-surface flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col h-[calc(100vh-12rem)]">
        
        <div className="flex items-center gap-4 mb-6 shrink-0">
           <span className="material-symbols-outlined text-primary text-4xl">record_voice_over</span>
           <div>
             <h1 className="font-headline-xl text-3xl text-primary tracking-tighter uppercase leading-none">SQUAD COMMS</h1>
             <p className="text-on-surface-variant/60 font-technical-code text-xs tracking-widest uppercase flex items-center gap-2">
               {isConnected ? (
                  <><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> UPLINK ACTIVE</>
               ) : (
                  <><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> OFFLINE</>
               )}
             </p>
           </div>
        </div>

        {/* Chat Area */}
        <div className="glass-panel rounded-[32px] flex-1 flex flex-col overflow-hidden border-2 border-primary/20 relative">
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg, idx) => {
              const isMe = msg.user_id === user?.id;
              return (
                <div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full border-2 shrink-0 overflow-hidden shadow-sm ${isMe ? 'border-primary/50 bg-primary-container' : 'border-outline-variant/30 bg-surface'}`}>
                    <img src={msg.users?.profile_picture_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user_id}`} alt="Avatar" className="w-full h-full object-cover mix-blend-multiply" />
                  </div>
                  
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                    <span className="font-technical-code text-[9px] text-on-surface-variant/60 uppercase tracking-widest mb-1 mx-1">
                      {msg.users?.display_name || (isMe ? 'YOU' : 'OPERATIVE')} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    
                    <div className={`px-5 py-3 text-sm leading-relaxed relative ${
                      isMe 
                      ? 'bg-primary text-on-primary rounded-[24px] rounded-tr-[8px] shadow-[0_5px_15px_rgba(120,157,145,0.3)]' 
                      : 'bg-surface-container text-on-surface rounded-[24px] rounded-tl-[8px] border border-outline-variant/30 shadow-sm'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-outline-variant/20 bg-surface/50 backdrop-blur-md">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input 
                placeholder="Transmit message to squad..." 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 sunken-input bg-surface border border-transparent focus:border-primary/30 rounded-2xl px-5 py-3 outline-none transition-colors font-technical-code text-on-surface"
                maxLength={500}
              />
              <button 
                type="submit" 
                disabled={!newMessage.trim()}
                className="chunky-button bg-primary text-white rounded-2xl w-14 h-[50px] flex items-center justify-center shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-all border-b-[3px] border-black/10"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
              </button>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
