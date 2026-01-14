import { AlertTriangle } from 'lucide-react';

export function Disclaimer() {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border/50">
      <AlertTriangle className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
      <div className="text-sm text-muted-foreground">
        <p className="font-medium text-foreground/80 mb-1">Medical Disclaimer</p>
        <p>
          This tool provides predictions based on machine learning and is <strong>not a substitute for professional medical advice</strong>. 
          Always consult a qualified healthcare provider for accurate diagnosis and treatment.
        </p>
      </div>
    </div>
  );
}
