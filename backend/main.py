from fastapi import FastAPI
import joblib
import pandas as pd
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware


from backend.schemas import SymptomInput

app = FastAPI(title="Disease Prediction API")
import os
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()  # loads .env into environment

#FRONTEND_ORIGINS = os.getenv("FRONTEND_ORIGINS", "")

#ALLOWED_ORIGINS = [
 #   origin.strip().rstrip("/")
  #  for origin in FRONTEND_ORIGINS.split(",")
   # if origin.strip()
#]


#origins = os.getenv("FRONTEND_ORIGINS", "")

#ALLOWED_ORIGINS = [origin.strip() for origin in origins.split(",") if origin.strip()]

#*app.add_middleware(
 #   CORSMiddleware,
#    allow_origins=ALLOWED_ORIGINS,
 #   allow_credentials=True,
 #   allow_methods=["*"],
 #   allow_headers=["*"],
#)
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TEMPORARY — DEBUG ONLY
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "ml" / "model.pkl"
ENCODER_PATH = BASE_DIR / "ml" / "label_encoder.pkl"
FEATURE_PATH = BASE_DIR / "ml" / "features.pkl"
FEATURE_NAMES = joblib.load(FEATURE_PATH)


model = joblib.load(MODEL_PATH)
label_encoder = joblib.load(ENCODER_PATH)

@app.get("/")
def health_check():
    return {"status": "API is running"}

@app.get("/symptoms")
def get_symptoms():
    return {
        "symptoms": FEATURE_NAMES
    }


@app.post("/predict")
def predict_disease(data: SymptomInput):

    # Initialize all features with 0
    input_dict = {feature: 0 for feature in FEATURE_NAMES}

    # Update with user-provided symptoms
    for symptom, value in data.symptoms.items():
        if symptom in input_dict:
            input_dict[symptom] = value

    # Convert to DataFrame
    input_df = pd.DataFrame([input_dict])

    # Prediction
    prediction_encoded = model.predict(input_df)[0]
    predicted_disease = label_encoder.inverse_transform([prediction_encoded])[0]

    # Prediction confidence
    probabilities = model.predict_proba(input_df)[0]
    confidence = float(max(probabilities))

    return {
        "predicted_disease": predicted_disease,
        "confidence": round(confidence, 3)
    }



