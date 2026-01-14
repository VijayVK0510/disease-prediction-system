import { Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PredictButtonProps {
  onClick: () => void;
  isLoading: boolean;
  isDisabled: boolean;
  selectedCount: number;
}

export function PredictButton({ onClick, isLoading, isDisabled, selectedCount }: PredictButtonProps) {
  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      size="lg"
      className="w-full sm:w-auto gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow font-semibold px-8 py-6 text-base rounded-xl transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:shadow-none"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 spinner" />
          Analyzing...
        </>
      ) : (
        <>
          <Sparkles className="w-5 h-5" />
          Predict Disease
          {selectedCount > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-primary-foreground/20 text-xs">
              {selectedCount}
            </span>
          )}
        </>
      )}
    </Button>
  );
}
