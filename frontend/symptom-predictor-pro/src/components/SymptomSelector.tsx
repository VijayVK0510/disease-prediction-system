import { useState, useMemo } from 'react';
import { Search, X, AlertCircle, RefreshCw } from 'lucide-react';
import { SymptomChip } from './SymptomChip';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface SymptomSelectorProps {
  symptoms: string[];
  selectedSymptoms: Set<string>;
  onToggleSymptom: (symptom: string) => void;
  onClearAll: () => void;
  isLoading: boolean;
  error: string | null;
  onRetry: () => void;
}

export function SymptomSelector({
  symptoms,
  selectedSymptoms,
  onToggleSymptom,
  onClearAll,
  isLoading,
  error,
  onRetry,
}: SymptomSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSymptoms = useMemo(() => {
    if (!searchQuery.trim()) return symptoms;
    const query = searchQuery.toLowerCase().replace(/\s+/g, '_');
    return symptoms.filter(symptom =>
      symptom.toLowerCase().includes(query) ||
      symptom.replace(/_/g, ' ').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [symptoms, searchQuery]);

  if (error) {
    return (
      <div className="glass-card rounded-2xl p-8 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Failed to Load Symptoms</h3>
        <p className="text-muted-foreground text-sm mb-4">{error}</p>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="glass-card rounded-2xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-muted rounded-lg" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 24 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-muted rounded-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-foreground">Select Your Symptoms</h2>
          <p className="text-sm text-muted-foreground">
            Choose all symptoms you're experiencing ({symptoms.length} available)
          </p>
        </div>
        
        {selectedSymptoms.size > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-muted-foreground hover:text-foreground gap-2 self-start"
          >
            <X className="w-4 h-4" />
            Clear ({selectedSymptoms.size})
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search symptoms..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-background/50"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Selected symptoms summary */}
      {selectedSymptoms.size > 0 && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <p className="text-sm text-primary font-medium">
            {selectedSymptoms.size} symptom{selectedSymptoms.size > 1 ? 's' : ''} selected
          </p>
        </div>
      )}

      {/* Symptom chips */}
      <div className="max-h-[400px] overflow-y-auto scrollbar-thin pr-2">
        {filteredSymptoms.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No symptoms match "{searchQuery}"
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {filteredSymptoms.map((symptom) => (
              <SymptomChip
                key={symptom}
                symptom={symptom}
                isSelected={selectedSymptoms.has(symptom)}
                onClick={() => onToggleSymptom(symptom)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
