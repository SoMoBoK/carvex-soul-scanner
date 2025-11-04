let walletAddress = null;

// ✅ Connect Backpack / Solana wallet
async function connectWallet() {
  try {
    const provider = window.backpack || window.solana;

    if (!provider) {
      alert("Backpack wallet not detected. Please install Backpack.");
      return;
    }

    const response = await provider.connect();
    walletAddress = response.publicKey.toString();

    document.getElementById("walletAddress").innerText =
      `Backpack Wallet: ${walletAddress}`;

    document.getElementById("scanBtn").disabled = false;
    alert("✅ Wallet Connected");
  } catch (err) {
    alert("Wallet connection failed: " + err.message);
  }
}

document.getElementById("connectBtn").addEventListener("click", connectWallet);


// ✅ AI Soul Scanner
async function scanSoul() {
  if (!walletAddress) return alert("Please connect wallet first!");

  const carvUID = document.getElementById("carvUID").value || "Not Provided";
  const resultBox = document.getElementById("result");
  resultBox.style.display = "block";
  resultBox.innerHTML = "⏳ Scanning soul... channeling CARV energy...";

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        wallet: walletAddress,
        carvUID: carvUID
      }),
    });

    const data = await response.json();
    resultBox.innerHTML = `
      ✅ <b>Soul Report</b><br><br>
      <b>Wallet:</b> ${walletAddress}<br>
      <b>CARV UID:</b> ${carvUID}<br><br>
      ✨ <b>Insight:</b><br>${data.answer}
      <br><br>
      ⚡ Powered by CARV x AI
    `;
  } catch (err) {
    resultBox.innerHTML = "❌ AI failed to read your soul. Try again!";
  }
}

document.getElementById("scanBtn").addEventListener("click", scanSoul);


// ✅ Light/Dark Mode
document.getElementById("themeBtn").onclick = () => {
  document.body.style.background =
    document.body.style.background === "white" ? "#0d1117" : "white";
  document.body.style.color =
    document.body.style.color === "black" ? "white" : "black";
};
