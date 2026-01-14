import pandas as pd
import joblib
from pathlib import Path

from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_PATH = BASE_DIR / "data" / "train_disease.csv"

df = pd.read_csv(DATA_PATH)
# Drop unwanted columns
df = df.drop(columns=["Unnamed: 133"], errors="ignore")



print("Dataset Shape:", df.shape)
print("First 5 rows:")
print(df.head())


# Separate features and target
X = df.drop("prognosis", axis=1)
FEATURE_NAMES = X.columns.tolist()

FEATURE_PATH = BASE_DIR / "ml" / "features.pkl"
joblib.dump(FEATURE_NAMES, FEATURE_PATH)

y = df["prognosis"]
print("Feature shape:", X.shape)
print("Target shape:", y.shape)



# Encode disease labels
label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)
print("Sample original labels:", y.unique()[:5])
print("Sample encoded labels:", y_encoded[:5])


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y_encoded,
    test_size=0.2,
    random_state=42,
    stratify=y_encoded
)


model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)


y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Model Accuracy:", accuracy)

print("\nClassification Report:")
print(classification_report(y_test, y_pred))


# Save trained model and label encoder
MODEL_SAVE_PATH = BASE_DIR / "ml" / "model.pkl"
ENCODER_SAVE_PATH = BASE_DIR / "ml" / "label_encoder.pkl"

joblib.dump(model, MODEL_SAVE_PATH)
joblib.dump(label_encoder, ENCODER_SAVE_PATH)


print("\nModel and Label Encoder saved successfully!")


