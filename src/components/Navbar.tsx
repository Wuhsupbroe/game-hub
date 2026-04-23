import Link from "next/link";
import { Gamepad2, MessageSquare, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">
            NEXT<span className="text-primary">LEVEL</span>
          </span>
        </div>
        
        <div className="hidden md:flex flex-1 items-center justify-center gap-8">
          <Link href="/" className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-primary">
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link href="/chat" className="flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-primary">
            <MessageSquare className="h-4 w-4" />
            Comms
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/20 hover:text-primary">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
