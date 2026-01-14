import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ConfidenceRingProps {
  confidence: number;
  size?: number;
  strokeWidth?: number;
}

function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.7) return 'stroke-confidence-high';
  if (confidence >= 0.4) return 'stroke-confidence-medium';
  return 'stroke-confidence-low';
}

function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.7) return 'High';
  if (confidence >= 0.4) return 'Moderate';
  return 'Low';
}

export function ConfidenceRing({ confidence, size = 120, strokeWidth = 8 }: ConfidenceRingProps) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedConfidence * circumference);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(confidence);
    }, 100);
    return () => clearTimeout(timer);
  }, [confidence]);

  const percentage = Math.round(confidence * 100);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="fill-none stroke-muted"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("fill-none confidence-ring", getConfidenceColor(confidence))}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-foreground">{percentage}%</span>
        <span className={cn(
          "text-xs font-medium",
          confidence >= 0.7 ? "text-confidence-high" :
          confidence >= 0.4 ? "text-confidence-medium" : "text-confidence-low"
        )}>
          {getConfidenceLabel(confidence)}
        </span>
      </div>
    </div>
  );
}
