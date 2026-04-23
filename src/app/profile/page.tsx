"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";
import { Sparkles, Save, User as UserIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ProfilePage() {
  const [displayName, setDisplayName] = useState("Player 1");
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [currentAvatar, setCurrentAvatar] = useState<string>("https://api.dicebear.com/7.x/bottts/svg?seed=Player1");
  
  // Hardcoded mock user for now
  const userId = "mock-uuid-1234";

  const handleGenerate = async () => {
    if (!prompt) {
      toast.error("Please enter a prompt describing your avatar.");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      setGeneratedUrl(data.url);
      toast.success("Avatar generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate avatar. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const newAvatarUrl = generatedUrl || currentAvatar;
      
      // Update in Supabase users table
      const { error } = await supabase
        .from('users')
        .update({ 
          display_name: displayName,
          profile_picture_url: newAvatarUrl
        })
        .eq('id', userId);
        
      if (error) throw error;
      
      setCurrentAvatar(newAvatarUrl);
      toast.success("Profile saved automatically to database!");
    } catch (error) {
      console.error(error);
      toast.warning("Profile saved locally (Supabase not fully connected yet).");
      setCurrentAvatar(generatedUrl || currentAvatar);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl animate-in slide-in-from-bottom-8 duration-500">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-white">Profile Identity</h1>
        <p className="text-muted-foreground mt-1">Customize your loadout and public appearance.</p>
      </div>

      <div className="space-y-6">
        <Card className="border-primary/20 bg-card/80 backdrop-blur-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserIcon className="w-5 h-5 text-primary" />
              Basic Intel
            </CardTitle>
            <CardDescription>How others see you in the field.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6">
              <Avatar className="w-24 h-24 border-2 border-primary/50 shadow-[0_0_15px_rgba(255,105,180,0.3)]">
                <AvatarImage src={currentAvatar} alt="Current Avatar" />
                <AvatarFallback className="bg-primary/20 text-primary text-xl">P1</AvatarFallback>
              </Avatar>
              <div className="space-y-1 flex-1">
                <Label htmlFor="displayName" className="text-muted-foreground">Display Name</Label>
                <Input 
                  id="displayName" 
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="bg-background/50 border-white/10 text-lg"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Sparkles className="w-5 h-5" />
              AI Avatar Generator
            </CardTitle>
            <CardDescription>Describe your ideal gaming identity, and our AI will manifest it.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Manifestation Prompt</Label>
              <div className="flex gap-2">
                <Input 
                  id="prompt" 
                  placeholder="e.g. A cyberpunk samurai bathed in neon pink light..." 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="bg-background border-white/10"
                />
                <Button 
                  onClick={handleGenerate} 
                  disabled={isGenerating || !prompt}
                  className="w-32 bg-primary/20 text-primary hover:bg-primary/30 border border-primary/50"
                >
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Generate"}
                </Button>
              </div>
            </div>

            {generatedUrl && (
              <div className="mt-6 p-4 rounded-xl bg-background border border-white/5 flex flex-col items-center gap-4">
                <p className="text-sm font-medium text-muted-foreground self-start">Generated Result:</p>
                <div className="relative">
                  <Avatar className="w-40 h-40 border-4 border-primary/20">
                    <AvatarImage src={generatedUrl} alt="Generated Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-full"></div>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end pt-6 border-t border-white/5">
            <Button 
              size="lg" 
              onClick={handleSaveProfile} 
              disabled={isSaving}
              className="gap-2 relative shadow-[0_0_15px_rgba(255,105,180,0.4)] transition-shadow hover:shadow-[0_0_25px_rgba(255,105,180,0.6)]"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
