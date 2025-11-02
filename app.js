let walletAddress = null;

document.getElementById("connectBtn").onclick = async () => {
  if (!window.Backpack) return alert("Install Backpack wallet!");
  try {
    const res = await window.Backpack.connect();
    walletAddress = res.publicKey;
    document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
    document.getElementById("scanBtn").disabled = false;
  } catch (e) { alert("Wallet connection failed"); }
};

document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value;
  if (uid) document.getElementById("uid").innerText = "CARV UID: " + uid;

  document.getElementById("result").innerText = "🔍 Scanning soul on CARV AI...";

  setTimeout(() => {
    document.getElementById("result").innerHTML = 
      "✅ Soul Score: <b>72</b><br>🧠 Traits: Loyal, Curious, Builder<br>✨ AI Insight: You're a Web3 explorer carving your destiny.";
  }, 1500);
};
