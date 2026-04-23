import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Gamepad2, Users, Check, X } from "lucide-react";
import { PlaytimeChart } from "@/components/PlaytimeChart";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Glory Awaits, <span className="text-primary">Player 1</span></h1>
          <p className="text-muted-foreground mt-1">Here's your command center.</p>
        </div>
        <Button className="font-bold relative overflow-hidden group">
          <span className="relative z-10 w-full h-full flex items-center gap-2">
            <Gamepad2 className="w-4 h-4" /> Schedule Session
          </span>
          <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Next Upcoming Session Widget */}
        <Card className="col-span-1 md:col-span-2 overflow-hidden border-primary/20 bg-card relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[50px] rounded-full pointer-events-none"></div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Next Deployment
            </CardTitle>
            <CardDescription>Your next confirmed gaming session.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-background/50 border border-white/5">
              <div className="h-24 w-24 rounded-lg bg-primary/20 border border-primary/50 flex items-center justify-center shrink-0">
                <Gamepad2 className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(255,105,180,0.8)]" />
              </div>
              <div className="space-y-2 flex-1 text-center sm:text-left">
                <h3 className="text-2xl font-bold">Helldivers 2</h3>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <Badge variant="secondary" className="bg-primary/20 text-primary hover:bg-primary/30">
                    Saturday, 8:00 PM
                  </Badge>
                  <Badge variant="outline">T-minus 2 days</Badge>
                </div>
                <p className="text-sm text-muted-foreground">With @Player2</p>
              </div>
              <div className="shrink-0 flex gap-2">
                <Button variant="outline" size="sm">Reschedule</Button>
                <Button size="sm">Go to Comms</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Favorite Game Widget */}
        <Card className="border-white/10 bg-card flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-purple-400" />
              Top Played
            </CardTitle>
            <CardDescription>Elden Ring</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col items-center justify-end pb-4">
            <h3 className="text-3xl font-bold self-start pl-2">142 <span className="text-lg text-muted-foreground">hrs</span></h3>
            <PlaytimeChart />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pending Requests Widget */}
        <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              Pending Requests
            </CardTitle>
            <CardDescription>Incoming session invites.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Mock Item */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/10 transition-colors hover:border-primary/50">
              <div className="flex flex-col">
                <span className="font-semibold text-white">Left 4 Dead 2</span>
                <span className="text-sm text-muted-foreground">Tomorrow, 9:00 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/20">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
             <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-white/10 transition-colors hover:border-primary/50">
              <div className="flex flex-col">
                <span className="font-semibold text-white">Lethal Company</span>
                <span className="text-sm text-muted-foreground">Friday, 11:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-400 hover:bg-green-500/20">
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/20">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
