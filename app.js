// =============== Wallet Providers ===============
function getBackpackProvider() {
  if ("xnft" in window && window.xnft.solana) {
    return window.xnft.solana;
  }
  return null;
}

function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

let walletAddress = "";

// =============== Soul Scoring Logic ===============
function getSoulArchetype(score) {
  if (score >= 90) return "✨ Visionary";
  if (score >= 75) return "⚡ Builder";
  if (score >= 60) return "🧭 Explorer";
  return "🌱 Rising Soul";
}

function getSoulXP(score) {
  return Math.floor(score * 1.2);
}

// Mock soul scoring — you can replace later
function generateRandomScore() {
  return Math.floor(Math.random() * 40) + 60; // 60–100 range
}

// =============== UI Elements ===============
const connectBtn = document.getElementById("connectBtn");
const scanBtn = document.getElementById("scanBtn");
const resultBox = document.getElementById("result");
const carvInput = document.getElementById("carvUid");

// =============== Wallet Connect ===============
connectBtn.onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();
  let provider = backpack || base;

  if (!provider) {
    alert("No wallet detected. Install Backpack or MetaMask/Base.");
    return;
  }

  try {
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
    } else {
      const res = await provider.connect();
      walletAddress = res.publicKey.toString();
    }

    document.getElementById("wallet").innerText = `Wallet: ${walletAddress}`;
    scanBtn.disabled = false;
  } catch (e) {
    alert("Wallet connection failed: " + e.message);
  }
};

// =============== Scan Soul ===============
scanBtn.onclick = () => {
  const carvUid = carvInput.value.trim() || "Not Provided";

  // Show scanning animation
  resultBox.innerHTML = `
    <div style="font-weight:600; margin-top:15px; font-size:18px;">
      🔍 Scanning Soul...
    </div>
    <div class="spinner"></div>
  `;

  setTimeout(() => {
    const score = generateRandomScore();
    const archetype = getSoulArchetype(score);
    const xp = getSoulXP(score);

    resultBox.innerHTML = `
      ✅ <b>Soul Score:</b> ${score}<br>
      🌐 <b>CARV UID:</b> ${carvUid}<br>
      🧠 <b>Traits:</b> Loyal, Curious, Builder<br>
      🎭 <b>Archetype:</b> ${archetype}<br>
      ⭐ <b>Earned XP:</b> ${xp}<br>
      ✨ <b>AI Insight:</b> You're a Web3 explorer carving your destiny.<br><br>

      <button id="shareBtn">Share on X</button>
    `;

    // Add share button logic
    document.getElementById("shareBtn").onclick = () => {
      const text = `Just scanned my Web3 Soul on CARV!  
Soul Score: ${score}  
Archetype: ${archetype}  
XP Earned: ${xp}  
Build your Web3 identity now 👇  
https://carv.io`;

      window.open(
        `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
        "_blank"
      );
    };

    // Style share button
    const shareBtn = document.getElementById("shareBtn");
    shareBtn.style.padding = "10px 18px";
    shareBtn.style.background = "linear-gradient(90deg,#00c2ff,#0077ff)";
    shareBtn.style.color = "#fff";
    shareBtn.style.border = "none";
    shareBtn.style.borderRadius = "10px";
    shareBtn.style.cursor = "pointer";
    shareBtn.style.fontWeight = "600";
  }, 1500);
};

