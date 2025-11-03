// ==============================
// Wallet + Providers
// ==============================
let walletAddress = null;

function getBackpackProvider() {
  if (window.backpack) return window.backpack;
  if (window.Backpack) return window.Backpack;
  if (window.solana && window.solana.isBackpack) return window.solana;
  return null;
}

function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

// ==============================
// CARV Profile Fetch
// ==============================
async function getCarvProfile(uid) {
  try {
    const res = await fetch(`https://api.carv.io/v1/profile/${uid}`);
    const data = await res.json();

    if (data?.data) {
      document.getElementById("carvProfile").style.display = "block";
      document.getElementById("carvAvatar").src = data.data.avatar;
      document.getElementById("carvName").innerText = data.data.username;
    }
  } catch (e) {
    console.log("CARV API Error:", e);
  }
}

// ==============================
// Soul Logic
// ==============================
function getSoulArchetype(score) {
  if (score >= 90) return "✨ Visionary";
  if (score >= 75) return "⚡ Builder";
  if (score >= 60) return "🧭 Explorer";
  return "🌱 Rising Soul";
}

function getSoulXP(score) {
  return Math.floor(score * 1.2);
}

// ==============================
// Wallet Connect Button
// ==============================
document.getElementById("connectBtn").onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();

  let provider = backpack || base;

  if (!provider) {
    alert("No wallet found. Install Backpack or MetaMask.");
    return;
  }

  try {
    // Base (MetaMask)
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
      document.getElementById("wallet").innerText = "Base Wallet: " + walletAddress;
      document.getElementById("scanBtn").disabled = false;
      return;
    }

    // Backpack
    const res = await provider.connect();
    walletAddress = res.publicKey.toString();
    document.getElementById("wallet").innerText = "Backpack Wallet: " + walletAddress;
    document.getElementById("scanBtn").disabled = false;
  } catch (err) {
    alert("Wallet connection failed: " + err.message);
  }
};

// ==============================
// Scan Soul Button
// ==============================
document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value;
  const resultBox = document.getElementById("result");

  if (uid) {
    document.getElementById("uid").innerText = "CARV UID: " + uid;
    getCarvProfile(uid);
  }

  // Show scanning animation
  resultBox.style.display = "block";
  resultBox.innerHTML = `
    <div class="spinner"></div>
    <p>🔍 Scanning soul...</p>
  `;

  setTimeout(() => {
    const score = 72; // static for demo — later dynamic via CARV API
    const archetype = getSoulArchetype(score);
    const xp = getSoulXP(score);

    resultBox.innerHTML = `
      ✅ <b>Soul Score:</b> ${score}<br>
      🧠 <b>Traits:</b> Loyal, Curious, Builder<br>
      🎭 <b>Archetype:</b> ${archetype}<br>
      ⭐ <b>Earned XP:</b> ${xp}<br>
      🪪 <b>CARV UID:</b> ${uid || "Not Provided"}<br><br>
      ✨ AI Insight:<br>You're a Web3 explorer carving your destiny.<br><br>

      <button id="shareX">Share on X 🕊️</button>
    `;

    document.getElementById("shareX").onclick = () => {
      const text = `I just scanned my Web3 Soul on CARV 🔮
Soul Score: ${score}
Archetype: ${archetype}
XP Earned: ${xp}
Explore your soul: carvex-soul-scanner.vercel.app`;

      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    };

  }, 1400);
};

// ==============================
// Dark Mode Toggle
// ==============================
document.getElementById("toggleDark").onclick = () => {
  document.body.classList.toggle("dark");
};
