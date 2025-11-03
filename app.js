let walletAddress = null;

// Wallet Provider
function getBackpackProvider() {
  return window.backpack?.ethereum ?? null;
}
function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

// Connect Wallet
document.getElementById("connectBtn").onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();
  let provider = backpack || base;

  if (!provider) return alert("Install Backpack or MetaMask (Base).");

  try {
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      document.getElementById("wallet").innerText = `Base Wallet: ${walletAddress}`;
      document.getElementById("scanBtn").disabled = false;
      return;
    }

    const res = await provider.connect();
    walletAddress = res.publicKey.toString();
    document.getElementById("wallet").innerText = `Backpack Wallet: ${walletAddress}`;
    document.getElementById("scanBtn").disabled = false;

  } catch (err) {
    alert("Wallet connection failed: " + err.message);
  }
};

// Archetype & XP Logic
function getSoulArchetype(score) {
  if (score >= 90) return "✨ Visionary";
  if (score >= 75) return "⚡ Builder";
  if (score >= 60) return "🧭 Explorer";
  return "🌱 Rising Soul";
}
function getSoulXP(score) {
  return Math.floor(score * 1.2);
}

// Scan Soul Button
document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value.trim();

  document.getElementById("result").innerHTML = `<div class="spinner"></div> Scanning soul...`;
  document.getElementById("resultBox").style.display = "block";

  // Example fixed score for now
  const score = 72;
  const archetype = getSoulArchetype(score);
  const xp = getSoulXP(score);
  const traits = "Loyal, Curious, Builder";

  // AI Prompt
  const prompt = `
You are the CARV Soul Oracle — part AI analyst, part mystical guide, part Web3 degen.
Generate a 2-sentence insight.

Tone: mystical + smart + Web3 energy + gamer motivation
- Score: ${score}
- Archetype: ${archetype}
- Traits: ${traits}
- CARV UID: ${uid || "Not provided"}

Rules:
- Interpret, don't repeat numbers
- Human tone, Web3 energy
- No cringe lines

Output only the insight text.
`;

  let aiText = "Your Web3 soul is awakening — keep carving your path.";

  try {
    const r = await fetch("/api/soul", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await r.json();
    aiText = data.reply;
  } catch (e) {}

  document.getElementById("result").innerHTML = `
✅ <b>Soul Score:</b> ${score}<br>
🧠 <b>Traits:</b> ${traits}<br>
🎭 <b>Archetype:</b> ${archetype}<br>
⭐ <b>Earned XP:</b> ${xp}<br>
🆔 <b>CARV UID:</b> ${uid || "Not Provided"}<br><br>
✨ <b>AI Insight:</b><br>${aiText}
  `;
};

// Share to X
document.getElementById("shareBtn").onclick = () => {
  const text = encodeURIComponent("I just scanned my Web3 Soul on CARV 🔮");
  window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
};

// Theme Toggle
document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};
