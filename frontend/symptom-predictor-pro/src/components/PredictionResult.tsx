import { Stethoscope, CheckCircle2 } from 'lucide-react';
import { PredictResponse } from '@/types/prediction';
import { ConfidenceRing } from './ConfidenceRing';

interface PredictionResultProps {
  result: PredictResponse;
  selectedSymptoms: string[];
}

function formatSymptomName(symptom: string): string {
  return symptom
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function PredictionResult({ result, selectedSymptoms }: PredictionResultProps) {
  const matchedSymptoms = result.matched_symptoms ?? {};
  const matchedSymptomsList = Object.keys(matchedSymptoms);


  return (
    <div className="result-card rounded-2xl p-6 border border-primary/20 slide-up">
      <div className="flex items-start gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Stethoscope className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-muted-foreground mb-1">Predicted Condition</h3>
          <p className="text-2xl font-bold text-foreground truncate">
            {result.predicted_disease}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        <ConfidenceRing confidence={result.confidence} />
        
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">
              Matched Symptoms ({matchedSymptomsList.length} selected)

            </h4>
            <div className="flex flex-wrap gap-1.5">
              {matchedSymptomsList.map(symptom => (
                <span
                  key={symptom}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                >
                  <CheckCircle2 className="w-3 h-3" />
                  {formatSymptomName(symptom)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
