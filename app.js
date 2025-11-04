let walletAddress = "";

// Wallet helpers
function getBackpackProvider() {
  return window.backpack?.solana;
}
function getBaseProvider() {
  if (window.ethereum && window.ethereum.isMetaMask) return window.ethereum;
  return null;
}

// Connect wallet
document.getElementById("connectBtn").onclick = async () => {
  const backpack = getBackpackProvider();
  const base = getBaseProvider();
  let provider = backpack || base;

  if (!provider) return alert("Install Backpack or MetaMask for Base.");

  try {
    if (provider === base) {
      const accounts = await provider.request({ method: "eth_requestAccounts" });
      walletAddress = accounts[0];
    } else {
      const res = await provider.connect();
      walletAddress = res.publicKey.toString();
    }

    document.getElementById("walletDisplay").innerText = walletAddress;
    document.getElementById("scanBtn").disabled = false;

  } catch (err) {
    console.error(err);
    alert("Wallet connection failed.");
  }
};

// AI fetch
async function getAIInsight(wallet, carvUID) {
  const res = await fetch("/api/ask", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ wallet, carvUID })
  });

  const data = await res.json();
  return data.answer || "Soul signal weak — try again ⚡";
}

// Scan button
document.getElementById("scanBtn").onclick = async () => {
  if (!walletAddress) return alert("Connect Wallet first");

  const carvUID = document.getElementById("carvUid").value || "Not Provided";

  document.getElementById("resultBox").style.display = "block";
  document.getElementById("insightText").innerHTML = `<div class='spinner'></div> Scanning Soul...`;

  const insight = await getAIInsight(walletAddress, carvUID);

  document.getElementById("wAddr").innerText = walletAddress;
  document.getElementById("uidText").innerText = carvUID;
  document.getElementById("insightText").innerText = insight;
};

// Theme toggle
document.getElementById("themeBtn").onclick = () => {
  document.body.classList.toggle("light");
  document.getElementById("themeBtn").innerText =
    document.body.classList.contains("light") ? "🌙 Theme" : "☀️ Theme";
};

// Share on X
document.getElementById("shareBtn").onclick = () => {
  const text = encodeURIComponent(`Just scanned my Web3 soul on CARV 🔮✨  
Wallet: ${walletAddress.slice(0,6)}...  
Try yours: https://carvex-soul-scanner.vercel.app`);
  window.open(`https://twitter.com/intent/tweet?text=${text}`);
};
