import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { SymptomSelector } from '@/components/SymptomSelector';
import { PredictButton } from '@/components/PredictButton';
import { PredictionResult } from '@/components/PredictionResult';
import { PredictionHistory } from '@/components/PredictionHistory';
import { Disclaimer } from '@/components/Disclaimer';
import { ErrorAlert } from '@/components/ErrorAlert';
import { usePredictionHistory } from '@/hooks/usePredictionHistory';
import { API_ENDPOINTS } from '@/config/api';
import { SymptomsResponse, PredictResponse } from '@/types/prediction';

export default function Index() {
  // State
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<string>>(new Set());
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState(true);
  const [symptomsError, setSymptomsError] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState<PredictResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);

  const { history, addPrediction, clearHistory, removeItem } = usePredictionHistory();

  // Fetch symptoms
  const fetchSymptoms = useCallback(async () => {
    setIsLoadingSymptoms(true);
    setSymptomsError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.symptoms);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data: SymptomsResponse = await response.json();
      setSymptoms(data.symptoms);
    } catch (error) {
      console.error('Failed to fetch symptoms:', error);
      setSymptomsError(
        error instanceof Error 
          ? error.message 
          : 'Unable to connect to the server. Please check your connection and try again.'
      );
    } finally {
      setIsLoadingSymptoms(false);
    }
  }, []);

  useEffect(() => {
    fetchSymptoms();
  }, [fetchSymptoms]);

  // Toggle symptom selection
  const handleToggleSymptom = useCallback((symptom: string) => {
    setSelectedSymptoms(prev => {
      const next = new Set(prev);
      if (next.has(symptom)) {
        next.delete(symptom);
      } else {
        next.add(symptom);
      }
      return next;
    });
  }, []);

  // Clear all selections
  const handleClearAll = useCallback(() => {
    setSelectedSymptoms(new Set());
    setPredictionResult(null);
    setPredictionError(null);
  }, []);

  // Make prediction
  const handlePredict = useCallback(async () => {
    if (selectedSymptoms.size === 0) return;

    setIsPredicting(true);
    setPredictionError(null);
    setPredictionResult(null);

    try {
      const symptomsPayload: Record<string, number> = {};
      selectedSymptoms.forEach(symptom => {
        symptomsPayload[symptom] = 1;
      });

      const response = await fetch(API_ENDPOINTS.predict, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ symptoms: symptomsPayload }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: PredictResponse = await response.json();
      setPredictionResult(data);
      
      // Add to history
      addPrediction(
        data.predicted_disease,
        data.confidence,
        Array.from(selectedSymptoms)
      );
    } catch (error) {
      console.error('Prediction failed:', error);
      setPredictionError(
        error instanceof Error 
          ? error.message 
          : 'Unable to get prediction. Please try again.'
      );
    } finally {
      setIsPredicting(false);
    }
  }, [selectedSymptoms, addPrediction]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-6 lg:py-10">
        <HeroSection />

        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          {/* Main content - Symptoms & Results */}
          <div className="lg:col-span-2 space-y-6">
            <SymptomSelector
              symptoms={symptoms}
              selectedSymptoms={selectedSymptoms}
              onToggleSymptom={handleToggleSymptom}
              onClearAll={handleClearAll}
              isLoading={isLoadingSymptoms}
              error={symptomsError}
              onRetry={fetchSymptoms}
            />

            {/* Predict Button */}
            {!symptomsError && !isLoadingSymptoms && (
              <div className="flex justify-center sm:justify-start">
                <PredictButton
                  onClick={handlePredict}
                  isLoading={isPredicting}
                  isDisabled={selectedSymptoms.size === 0}
                  selectedCount={selectedSymptoms.size}
                />
              </div>
            )}

            {/* Prediction Error */}
            {predictionError && (
              <ErrorAlert
                message={predictionError}
                onDismiss={() => setPredictionError(null)}
              />
            )}

            {/* Prediction Result */}
            {predictionResult && (
              <PredictionResult
                result={predictionResult}
                selectedSymptoms={Array.from(selectedSymptoms)}
              />
            )}

            {/* Disclaimer */}
            <Disclaimer />
          </div>

          {/* Sidebar - History */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24">
              <PredictionHistory
                history={history}
                onClear={clearHistory}
                onRemove={removeItem}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 mt-16 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>SymptomAI Disease Prediction System • For educational purposes only</p>
        </div>
      </footer>
    </div>
  );
}
