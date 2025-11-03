let walletAddress = "";
const connectBtn = document.getElementById("connectBtn");
const scanBtn = document.getElementById("scanBtn");
const resultBox = document.getElementById("result");

// Connect wallet
connectBtn.onclick = async () => {
  if (!window.ethereum) return alert("Install MetaMask first");

  const accounts = await ethereum.request({ method: "eth_requestAccounts" });
  walletAddress = accounts[0];
  document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
  scanBtn.disabled = false;
};

// Fake scanning animation
function showScanning() {
  resultBox.innerHTML = `<div class="scan-loading">🔍 Scanning Soul...</div>`;
}

// Soul scan simulation
scanBtn.onclick = async () => {
  showScanning();

  setTimeout(() => {
    const score = Math.floor(Math.random() * 1000) + 1;
    const carvUid = document.getElementById("carvUid").value || "Unknown";

    resultBox.innerHTML = `
      <b>✨ Soul Score:</b> ${score}<br>
      <b>Wallet:</b> ${walletAddress}<br>
      <b>CARV UID:</b> ${carvUid}<br><br>

      <button id="shareBtn">Share on X 🐦</button>
    `;

    document.getElementById("shareBtn").onclick = () => {
      const text = `Just scanned my digital soul on CARV 👁\nSoul Score: ${score}\n\nOn-chain identity is the future. 🚀`;
      const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
      window.open(url, "_blank");
    };

  }, 2000);
};

// ✅ Dark / light mode toggle
document.getElementById("darkToggle").onclick = () => {
  document.body.classList.toggle("light");
  const logo = document.getElementById("carvLogo");

  if (document.body.classList.contains("light")) {
    logo.src = "https://carv.io/logo-light.png";
    darkToggle.innerText = "🌙 Dark";
  } else {
    logo.src = "https://carv.io/logo-dark.png";
    darkToggle.innerText = "☀ Light";
  }
};
