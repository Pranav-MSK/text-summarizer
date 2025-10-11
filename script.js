// DOM elements
const summarizeBtn = document.getElementById("summarizeBtn");
const inputText = document.getElementById("inputText");
const summaryOutput = document.getElementById("summaryOutput");
const copyBtn = document.getElementById("copyBtn");

// Check if Chrome Built-in AI is available
async function isAIAvailable() {
  return ("ai" in window) && window.ai.createTextSession;
}

// Fallback dummy function for testing/demo
async function getDummySummary(text) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve("🔹 Dummy summary (for demo purposes): " + text.slice(0, 100) + "...");
    }, 500);
  });
}

// Main function to summarize text
async function getSummary(text) {
  if (await isAIAvailable()) {
    try {
      const session = await window.ai.createTextSession();
      const prompt = `Summarize the following text in 3–5 sentences:\n\n${text}`;
      const summary = await session.prompt(prompt);
      return summary;
    } catch (err) {
      console.error(err);
      return "❌ Error using Gemini Nano. Using dummy summary instead.";
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
  const summary = await getSummary(text);
  summaryOutput.innerText = summary;
});

// Handle copy summary button click
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
