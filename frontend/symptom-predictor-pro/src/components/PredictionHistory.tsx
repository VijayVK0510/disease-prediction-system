import { Clock, Trash2, ChevronRight } from 'lucide-react';
import { PredictionHistoryItem } from '@/types/prediction';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PredictionHistoryProps {
  history: PredictionHistoryItem[];
  onClear: () => void;
  onRemove: (id: string) => void;
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // Less than 1 minute
  if (diff < 60000) return 'Just now';
  // Less than 1 hour
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  // Less than 24 hours
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  // Less than 7 days
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'text-confidence-high';
  if (confidence >= 0.4) return 'text-confidence-medium';
  return 'text-confidence-low';
}

export function PredictionHistory({ history, onClear, onRemove }: PredictionHistoryProps) {
  if (history.length === 0) {
    return (
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Prediction History</h3>
        </div>
        <p className="text-sm text-muted-foreground text-center py-8">
          Your prediction history will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Prediction History</h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-muted-foreground hover:text-destructive gap-1.5 text-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </Button>
      </div>

      <div className="space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin pr-1">
        {history.map((item, index) => (
          <div
            key={item.id}
            className="history-item group fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-foreground truncate">
                    {item.disease}
                  </span>
                  <span className={cn("text-sm font-semibold", getConfidenceColor(item.confidence))}>
                    {Math.round(item.confidence * 100)}%
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{formatDate(item.timestamp)}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{item.symptoms.length} symptoms</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onRemove(item.id)}
                className="w-7 h-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
