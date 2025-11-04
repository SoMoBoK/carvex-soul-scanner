// ---------- config & helpers ----------
let walletAddress = null;
const connectBtn = document.getElementById("connectBtn");
const scanBtn    = document.getElementById("scanBtn");
const themeBtn   = document.getElementById("themeBtn");
const resultBox  = document.getElementById("resultBox");
const wAddrEl    = document.getElementById("wAddr");
const uidTextEl  = document.getElementById("uidText");
const insightEl  = document.getElementById("insightText");
const walletText = document.getElementById("walletText");
const shareBtn   = document.getElementById("shareBtn");

function getBackpackProvider(){ return window.backpack?.solana || window.solana?.isBackpack ? window.solana : null; }
function getBaseProvider(){ return (window.ethereum && window.ethereum.isMetaMask) ? window.ethereum : null; }

// ---------- wallet connect (Backpack or Base) ----------
connectBtn.addEventListener("click", async () => {
  try {
    const backpack = getBackpackProvider();
    const base = getBaseProvider();
    const provider = backpack || base;
    if (!provider) return alert("No wallet detected. Install Backpack (Solana) or MetaMask (Base).");

    if (provider === base) {
      // EVM (MetaMask/Base)
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
    } else {
      // Solana / Backpack
      const res = await provider.connect();
      // many solana wallets return publicKey object (res.publicKey) or string
      walletAddress = res?.publicKey?.toString?.() || res?.toString?.() || res;
    }

    walletText.innerText = `Wallet: ${walletAddress}`;
    wAddrEl.innerText = walletAddress;
    scanBtn.disabled = false;
    scanBtn.classList.remove("btn-disabled");
    scanBtn.classList.add("btn-primary");
    resultBox.style.display = "none";
  } catch (err) {
    console.error("connect error", err);
    alert("Wallet connection failed: " + (err?.message || err));
  }
});

// ---------- call AI endpoint ----------
async function fetchAIInsight(wallet, carvUid) {
  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify({ wallet, carvUID: carvUid })
    });

    const json = await res.json();
    // Accept backend returned { answer: "..." } or { output: "..." }
    return json?.answer || json?.output || null;
  } catch (err) {
    console.error("AI fetch error", err);
    return null;
  }
}

// ---------- scanning flow ----------
scanBtn.addEventListener("click", async () => {
  if (!walletAddress) return alert("Please connect wallet first.");
  const carvUid = document.getElementById("carvUid").value.trim() || "Not Provided";

  // show spinner + open card
  resultBox.style.display = "block";
  insightEl.innerHTML = "<div class='spinner'></div> Channeling CARV AI...";
  uidTextEl.innerText = carvUid;
  wAddrEl.innerText = walletAddress;

  // call backend
  const aiText = await fetchAIInsight(walletAddress, carvUid);

  if (!aiText) {
    insightEl.innerText = "AI failed to read your soul — try again ⚡";
  } else {
    insightEl.innerText = aiText;
  }

  // update share button action
  shareBtn.onclick = () => {
    const short = walletAddress?.slice(0,6) + (walletAddress?.length>10 ? "..." : "");
    const tweet = `I scanned my CARV soul 🔮\n${short}\n${aiText?.slice(0,140) || ""}\nhttps://carvex-soul-scanner.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
  };
});

// ---------- theme toggle ----------
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("light");
  // optional: persist theme in localStorage
});

// friendly console info
console.log("CARV Soul Scanner ready");
