let walletAddress = null;
const scanBtn = document.getElementById("scanBtn");
const resultBox = document.getElementById("result");
const scanStatus = document.getElementById("scanStatus");

// Dark mode toggle
document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("light");
};

// backpack provider
function getBackpackProvider() {
  if ("backpack" in window) return window.backpack;
  if ("phantom" in window) return window.phantom?.solana;
  return null;
}

// base provider (MetaMask)
function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

// Wallet connect
document.getElementById("connectBtn").onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();
  let provider = backpack || base;

  if (!provider) {
    alert("No wallet found — install Backpack or MetaMask (Base).");
    return;
  }

  try {
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      document.getElementById("wallet").innerText = "Base Wallet: " + walletAddress;
      scanBtn.disabled = false;
      return;
    }

    const res = await provider.connect();
    walletAddress = res.publicKey.toString();
    document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
    scanBtn.disabled = false;
  } catch (e) {
    alert("Wallet connection failed: " + e.message);
  }
};

// Soul archetype logic
function getSoulArchetype(score) {
  if (score >= 90) return "✨ Visionary";
  if (score >= 75) return "⚡ Builder";
  if (score >= 60) return "🧭 Explorer";
  return "🌱 Rising Soul";
}

function getSoulXP(score) { 
  return Math.floor(score * 1.2);
}

// Scan soul
scanBtn.onclick = () => {
  scanStatus.innerText = "⏳ Scanning soul energy...";
  resultBox.style.display = "none";

  setTimeout(() => {
    const score = 72;
    const archetype = getSoulArchetype(score);
    const xp = getSoulXP(score);

    scanStatus.innerText = "";
    resultBox.style.display = "block";
    
    resultBox.innerHTML = `
      ✅ Soul Score: <b>${score}</b><br>
      🧠 Traits: Loyal, Curious, Builder<br>
      🎭 Archetype: <b>${archetype}</b><br>
      ⭐ Earned XP: <b>${xp}</b><br>
      ✨ AI Insight: You're a Web3 explorer carving your destiny.<br><br>
      <button id="shareBtn">Share on X</button>
    `;

    document.getElementById("shareBtn").onclick = () => {
      const text = encodeURIComponent(
        `I just scanned my on-chain soul on CARV 👤✨\nSoul Score: ${score}\nArchetype: ${archetype}\n#CARV #OnchainIdentity`
      );
      window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank");
    };

  }, 1800);
};
