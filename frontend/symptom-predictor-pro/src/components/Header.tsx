import { Activity, Heart } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="font-semibold text-lg text-foreground">SymptomAI</h1>
            <p className="text-xs text-muted-foreground">Disease Prediction System</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Heart className="w-3.5 h-3.5 text-primary" />
          <span>Powered by ML</span>
        </div>
      </div>
    </header>
  );
}
