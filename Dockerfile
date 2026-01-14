# 1️⃣ Base image
FROM python:3.10-slim

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Copy dependency file
COPY requirements.txt .

# 4️⃣ Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# 5️⃣ Copy backend and ML artifacts
COPY backend ./backend
COPY ml ./ml

# 6️⃣ Expose port (Render expects 10000)
EXPOSE 10000

# 7️⃣ Start FastAPI app
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "$PORT"]

