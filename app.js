// ✅ Backpack + Base wallet logic + gamification

let walletAddress = null;

// Backpack detection
function getBackpackProvider() {
  if (window.backpack) return window.backpack;
  if (window.Backpack) return window.Backpack;
  if (window.solana && window.solana.isBackpack) return window.solana;
  return null;
}

// Base / MetaMask provider
function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

// Soul archetype logic
function getSoulArchetype(score) {
  if (score >= 90) return "✨ Visionary";
  if (score >= 75) return "⚡ Builder";
  if (score >= 60) return "🧭 Explorer";
  return "🌱 Rising Soul";
}

// XP formula
function getSoulXP(score) {
  return Math.floor(score * 1.2);
}

// Connect wallet button
document.getElementById("connectBtn").onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();
  let provider = backpack || base;

  if (!provider) {
    alert("No wallet detected. Install Backpack or MetaMask (Base).");
    return;
  }

  try {
    // ✅ Base (MetaMask)
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      document.getElementById("wallet").innerText = "Base Wallet: " + walletAddress;
      document.getElementById("scanBtn").disabled = false;
      return;
    }

    // ✅ Backpack connect
    const res = await provider.connect();
    walletAddress = res.publicKey.toString();
    document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
    document.getElementById("scanBtn").disabled = false;

  } catch (e) {
    alert("Wallet connection failed: " + e.message);
  }
};

// Scan button
document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value;
  if (uid) document.getElementById("uid").innerText = "CARV UID: " + uid;

  // Fake score for now
  const score = 72;
  const archetype = getSoulArchetype(score);
  const xp = getSoulXP(score);

  document.getElementById("result").innerHTML = `
    ✅ Soul Score: <b>${score}</b><br>
    🧠 Traits: Loyal, Curious, Builder<br>
    🎭 Archetype: <b>${archetype}</b><br>
    ⭐ Earned XP: <b>${xp}</b><br>
    ✨ AI Insight: You're a Web3 explorer carving your destiny.
  `;
};
