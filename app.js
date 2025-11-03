async function scanSoul() {
  const input = document.getElementById("walletInput").value.trim();
  const resultBox = document.getElementById("result");

  if (!input) {
    resultBox.style.display = "block";
    resultBox.innerHTML = "⚠️ Please enter a wallet address, CARV uID, or ENS.";
    return;
  }

  // Show scanning UI
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <div class="spinner"></div>
    <div class="scanning">Scanning user soul on CARV...</div>
  `;

  // Simulate API + AI analysis delay
  await new Promise((resolve) => setTimeout(resolve, 2200));

  // Generate playful AI soul result
  const aiResult = generateSoulResult();

  resultBox.innerHTML = `
    ✅ <b>Scan Complete</b><br><br>
    👤 <b>Identity:</b> ${input}<br>
    🧠 <b>Soul Analysis:</b><br> ${aiResult}<br><br>

    <button onclick="shareOnX('${input}', \`${aiResult.replace(/`/g, "")}\`)">
      🚀 Share Soul Score on X
    </button>
  `;
}

// Random playful outputs
function generateSoulResult() {
  const results = [
    "A true Web3 explorer with strong degen spirit and DAO loyalty.",
    "High synergy score — destined for multi-chain greatness.",
    "Elite gamer — sharp reflexes, sharper alpha instincts.",
    "Builder soul detected — innovation bias at 110%.",
    "Web3 diplomat — bridges communities, vibes always clean.",
    "Strong on-chain presence. Probably farming something right now.",
    "Future zk-powered AI cyborg (in a good way).",
  ];
  return results[Math.floor(Math.random() * results.length)];
}

// Share to X
function shareOnX(uid, soul) {
  const text = `🔍 CARV Soul Scan Result\n\n👤 ${uid}\n🧠 ${soul}\n\nScanned via CARV Soul Scanner`;
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// Dark mode toggle
function toggleTheme() {
  document.body.classList.toggle("light-mode");
}
