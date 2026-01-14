// Improved UI interactions: chips, spinner, animated result card

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBox").addEventListener("input", filterSymptoms);
  document.getElementById("predictBtn").addEventListener("click", predictDisease);
  document.getElementById("clearBtn").addEventListener("click", clearSelection);
  loadSymptoms();
  loadHistory();

});

async function loadSymptoms() {
  try {
    const resp = await fetch("http://127.0.0.1:10000/symptoms");
    const json = await resp.json();
    renderSymptoms(json.symptoms || []);
  } catch (err) {
    renderSymptoms([]); // keep UI responsive
    console.error("Failed to load symptoms:", err);
  }
}

function renderSymptoms(list) {
  const container = document.getElementById("symptom-list");
  container.innerHTML = "";

  if (!list.length) {
    container.innerHTML = '<div class="center" style="padding:24px;color:var(--muted)">No symptoms available</div>';
    return;
  }

  list.forEach(symptom => {
    const id = `s_${CSS.escape(symptom)}`;

    const item = document.createElement("label");
    item.className = "symptom-item";
    item.setAttribute("data-symptom", symptom);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.value = symptom;

    const title = document.createElement("div");
    title.className = "symptom-title";
    title.textContent = symptom.replace(/_/g, " ").toUpperCase();

    // When clicking the whole label, toggle selection class and checkbox
    item.appendChild(checkbox);
    item.appendChild(title);

    item.addEventListener("click", (e) => {
      // Prevent double-handling when clicking the checkbox directly
      if (e.target.tagName.toLowerCase() === "input") return;
      checkbox.checked = !checkbox.checked;
      item.classList.toggle("selected", checkbox.checked);
    });

    // Keep visual state in sync if checkbox changed directly
    checkbox.addEventListener("change", () => {
      item.classList.toggle("selected", checkbox.checked);
    });

    container.appendChild(item);
  });
}

function filterSymptoms() {
  const q = document.getElementById("searchBox").value.trim().toLowerCase();
  const nodes = document.querySelectorAll("#symptom-list .symptom-item");
  nodes.forEach(n => {
    const text = n.textContent.toLowerCase();
    n.style.display = text.includes(q) ? "flex" : "none";
  });
}

function clearSelection() {
  document.querySelectorAll("#symptom-list input[type='checkbox']").forEach(cb => {
    cb.checked = false;
    cb.closest(".symptom-item")?.classList.remove("selected");
  });
  hideResult();
}

function showSpinner(show = true) {
  const el = document.getElementById("spinnerOverlay");
  el.classList.toggle("hidden", !show);
  el.setAttribute("aria-hidden", String(!show));
}

async function predictDisease() {
  const checked = Array.from(document.querySelectorAll("#symptom-list input:checked"));
  if (!checked.length) {
    // quick attention animation
    const grid = document.querySelector(".symptom-grid");
    grid.animate([
      { transform: "translateX(0)" },
      { transform: "translateX(-6px)" },
      { transform: "translateX(6px)" },
      { transform: "translateX(0)" }
    ], { duration: 350, easing: "ease-out" });
    return;
  }

  const selectedSymptoms = {};
  checked.forEach(cb => { selectedSymptoms[cb.value] = 1; });

  showSpinner(true);
  hideResult();

  try {
    const resp = await fetch("http://127.0.0.1:10000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptoms: selectedSymptoms })
    });

    const data = await resp.json();
    showSpinner(false);
    if (resp.ok) showResult(data);
    else showError(data?.detail || "Prediction failed");
  } catch (err) {
    showSpinner(false);
    console.error(err);
    showError("Network error — try again");
  }
}

function showResult(data) {
  const area = document.getElementById("result-area");
  const confidence = (data.confidence ?? 0) * 100;
  const disease = data.predicted_disease || "Unknown";

  const card = document.createElement("div");
  card.className = "result-card";

  const icon = document.createElement("div");
  icon.className = "result-icon";
  icon.style.background = "linear-gradient(135deg,var(--accent),var(--primary))";
  icon.textContent = "🩺";

  const body = document.createElement("div");
  body.className = "result-body";

  const title = document.createElement("h4");
  title.className = "result-title";
  title.textContent = disease;

  const meta = document.createElement("div");
  meta.className = "result-meta";
  meta.textContent = `Confidence: ${confidence.toFixed(2)}% • Symptoms matched: ${Object.keys(data.matched_symptoms || {}).length || "N/A"}`;

  body.appendChild(title);
  body.appendChild(meta);

  const actions = document.createElement("div");
  actions.className = "result-actions";

  const advice = document.createElement("button");
  advice.className = "muted";
  advice.textContent = "More Info";
  advice.addEventListener("click", () => {
    window.alert("Consult a medical professional. This is a predictive tool only.");
  });

  actions.appendChild(advice);

  card.appendChild(icon);
  card.appendChild(body);
  card.appendChild(actions);

  area.innerHTML = "";
  area.appendChild(card);

  // trigger animation
  requestAnimationFrame(() => card.classList.add("visible"));
  card.scrollIntoView({ behavior: "smooth", block: "start" });


  // --- SAVE TO HISTORY ---
const historyEntry = {
  disease,
  confidence: confidence.toFixed(2),
  date: new Date().toLocaleString()
};

saveToHistory(historyEntry);
loadHistory();

}

function showError(msg) {
  const area = document.getElementById("result-area");
  area.innerHTML = `<div class="result-card visible" style="border:1px solid rgba(239,68,68,0.12)">
    <div class="result-icon" style="background:linear-gradient(135deg,var(--danger),#ff7a7a)">⚠️</div>
    <div class="result-body"><h4 class="result-title">Error</h4><div class="result-meta">${msg}</div></div>
  </div>`;
}

function hideResult() {
  const area = document.getElementById("result-area");
  area.innerHTML = "";
}

function saveToHistory(entry) {
  const history = JSON.parse(localStorage.getItem("predictionHistory")) || [];
  history.unshift(entry); // newest first
  localStorage.setItem("predictionHistory", JSON.stringify(history));
}

function loadHistory() {
  const list = document.getElementById("history-list");
  if (!list) return;

  const history = JSON.parse(localStorage.getItem("predictionHistory")) || [];
  list.innerHTML = "";

  if (!history.length) {
    list.innerHTML = `<div class="center" style="color:var(--muted)">No predictions yet</div>`;
    return;
  }

  history.forEach(item => {
    const div = document.createElement("div");
    div.className = "history-item";

    div.innerHTML = `
      <div>
        <strong>${item.disease}</strong>
        <div class="meta">${item.date}</div>
      </div>
      <div class="meta">${item.confidence}%</div>
    `;

    list.appendChild(div);
  });
}
