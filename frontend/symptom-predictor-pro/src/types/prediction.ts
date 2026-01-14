export interface SymptomsResponse {
  symptoms: string[];
}

export interface PredictRequest {
  symptoms: Record<string, number>;
}

export interface PredictResponse {
  predicted_disease: string;
  confidence: number;
  matched_symptoms: Record<string, number>;
}

export interface PredictionHistoryItem {
  id: string;
  disease: string;
  confidence: number;
  symptoms: string[];
  timestamp: string;
}
