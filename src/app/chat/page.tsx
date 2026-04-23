"use client";

import { useEffect, useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Send, ServerCrash } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  // Mock users for the UI since auth isn't fully linked
  const CURRENT_USER_ID = "mock-uuid-1234"; 

  useEffect(() => {
    // 1. Fetch historical messages
    const fetchMessages = async () => {
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
        if (data) setMessages(data as any);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        // Fallback mock messages if Supabase isn't hooked up yet
        setMessages([
          { id: '1', user_id: 'other-user', content: 'Ready for Helldivers?', created_at: new Date(Date.now() - 3600000).toISOString(), users: { display_name: 'Player 2', profile_picture_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=P2' } },
          { id: '2', user_id: CURRENT_USER_ID, content: 'Hell yeah. Give me 10 mins.', created_at: new Date(Date.now() - 3000000).toISOString(), users: { display_name: 'Player 1', profile_picture_url: 'https://api.dicebear.com/7.x/bottts/svg?seed=Player1' } },
        ]);
      }
    };

    fetchMessages();

    // 2. Subscribe to real-time events
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const newMsg = payload.new as Message;
        // In a real app, we'd fetch the joined user data here, or just push the raw message.
        // For simplicity we just inject it if it's not our own (our own is handled optimistically)
        if (newMsg.user_id !== CURRENT_USER_ID) {
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
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const payloadContent = newMessage.trim();
    setNewMessage("");

    // Optimistic UI update
    const tempId = Date.now().toString();
    const optimisticMsg: Message = {
      id: tempId,
      user_id: CURRENT_USER_ID,
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
        .insert([{ content: payloadContent, user_id: CURRENT_USER_ID }]);
        
      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast.error("Failed to send message over the network. Is DB configured?");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl h-[calc(100vh-4rem)] flex flex-col pt-20">
      <Card className="flex-1 flex flex-col overflow-hidden border-primary/20 bg-background/80 backdrop-blur-xl shrink-0 h-full max-h-[800px]">
        <CardHeader className="border-b border-white/5 bg-card/50 flex flex-row items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-primary" />
            <div>
              <CardTitle className="text-xl">Squad Comms</CardTitle>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {isConnected ? (
                  <><span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Uplink Active</>
                ) : (
                  <><ServerCrash className="w-3 h-3 text-destructive" /> Awaiting Connection...</>
                )}
              </p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 overflow-hidden">
          <ScrollArea ref={scrollRef} className="h-full px-4 py-6">
            <div className="flex flex-col gap-4 justify-end min-h-full">
              {messages.map((msg, idx) => {
                const isMe = msg.user_id === CURRENT_USER_ID;
                return (
                  <div key={msg.id || idx} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                    <Avatar className={`w-8 h-8 ${isMe ? 'border-primary/50' : 'border-white/10'}`}>
                      <AvatarImage src={msg.users?.profile_picture_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${msg.user_id}`} />
                      <AvatarFallback>{isMe ? 'P1' : 'P2'}</AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      <span className="text-xs text-muted-foreground mb-1 ml-1 mr-1">
                        {msg.users?.display_name || 'Operator'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                        isMe 
                        ? 'bg-primary text-primary-foreground rounded-tr-sm shadow-[0_4px_15px_rgba(255,105,180,0.2)]' 
                        : 'bg-muted text-foreground rounded-tl-sm border border-white/5'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="p-4 border-t border-white/5 bg-card/50">
          <form onSubmit={handleSendMessage} className="w-full flex gap-2">
            <Input 
              placeholder="Transmit message to squad..." 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 bg-background border-white/10 focus-visible:ring-primary/50"
              maxLength={500}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!newMessage.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90 shrink-0 shadow-[0_0_10px_rgba(255,105,180,0.3)] transition-shadow hover:shadow-[0_0_20px_rgba(255,105,180,0.5)]"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
