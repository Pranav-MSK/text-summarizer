// DOM elements
const summarizeBtn = document.getElementById("summarizeBtn");
const inputText = document.getElementById("inputText");
const summaryOutput = document.getElementById("summaryOutput");
const copyBtn = document.getElementById("copyBtn");
const statusMessage = document.getElementById("statusMessage");

// Check if Chrome Built-in AI is available
async function isAIAvailable() {
  return ("ai" in window) && typeof window.ai.createTextSession === "function";
}

// Dummy fallback summary (for browsers without Gemini Nano)
async function getDummySummary(text) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("🔹 Dummy summary (for demo purposes): " + text.slice(0, 100) + "...");
    }, 600);
  });
}

// Main summarization function
async function getSummary(text) {
  if (await isAIAvailable()) {
    try {
      const session = await window.ai.createTextSession();
      const prompt = `Summarize the following text in 3–5 sentences:\n\n${text}`;
      const summary = await session.prompt(prompt);
      return "🧠 (Chrome AI) " + summary;
    } catch (err) {
      console.error("Error using Chrome AI:", err);
      return "❌ Error using Chrome AI. Using dummy summary instead:\n\n" + (await getDummySummary(text));
    }
  } else {
    return getDummySummary(text);
  }
}

// Handle summarize button click
summarizeBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (!text) {
    summaryOutput.innerText = "Please enter some text to summarize.";
    return;
  }

  summaryOutput.innerText = "Summarizing...";
  statusMessage.innerText = "";

  const aiAvailable = await isAIAvailable();
  statusMessage.innerText = aiAvailable
    ? "✅ Using Chrome’s Built-in AI (Gemini Nano)"
    : "⚠️ Chrome AI not available — using fallback summarizer.";

  const summary = await getSummary(text);
  summaryOutput.innerText = summary;
});

// Handle copy button
copyBtn.addEventListener("click", () => {
  const text = summaryOutput.innerText.trim();
  if (!text) return;
  
  navigator.clipboard.writeText(text).then(() => {
    copyBtn.innerText = "Copied!";
    setTimeout(() => {
      copyBtn.innerText = "Copy Summary";
    }, 1500);
  }).catch(err => {
    console.error("Failed to copy text:", err);
  });
});

// On page load, show AI availability
window.addEventListener("load", async () => {
  const aiAvailable = await isAIAvailable();
  statusMessage.innerText = aiAvailable
    ? "✅ Chrome AI ready (Gemini Nano detected)"
    : "⚠️ Chrome AI not detected — using fallback mode.";
});
