import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SymptomChipProps {
  symptom: string;
  isSelected: boolean;
  onClick: () => void;
}

function formatSymptomName(symptom: string): string {
  return symptom
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function SymptomChip({ symptom, isSelected, onClick }: SymptomChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "symptom-chip flex items-center gap-2",
        isSelected && "selected"
      )}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <Check className="w-3.5 h-3.5 shrink-0" />
      )}
      <span className="truncate">{formatSymptomName(symptom)}</span>
    </button>
  );
}
