import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onDismiss: () => void;
}

export function ErrorAlert({ message, onDismiss }: ErrorAlertProps) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 fade-in">
      <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      <div className="flex-1 text-sm">
        <p className="font-medium text-destructive mb-1">Prediction Failed</p>
        <p className="text-destructive/80">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="text-destructive/60 hover:text-destructive transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
