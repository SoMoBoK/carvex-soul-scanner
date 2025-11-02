// Fixed Backpack detection and connect logic
let walletAddress = null;

function getBackpackProvider() {
  // Backpack sometimes injects under window.backpack or window.Backpack or window.solana (with isBackpack)
  if (window.backpack) return window.backpack;
  if (window.Backpack) return window.Backpack;
  if (window.solana && window.solana.isBackpack) return window.solana;
  return null;
}

document.getElementById("connectBtn").onclick = async () => {
  const provider = getBackpackProvider();
  if (!provider) {
    alert("Backpack wallet not detected. Make sure Backpack is installed and enabled for this site.");
    return;
  }

  try {
    // Some providers use connect(), some use request with 'connect' method
    let res;
    if (provider.connect) {
      res = await provider.connect();
    } else if (provider.request) {
      res = await provider.request({ method: "connect" });
    } else {
      throw new Error("Unsupported Backpack provider API");
    }

    // Normalize public key string
    const pub = (res && res.publicKey) ? res.publicKey.toString() : (res && res[0] ? res[0].toString() : null);
    if (!pub) throw new Error("No public key returned");

    walletAddress = pub;
    document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
    document.getElementById("scanBtn").disabled = false;
  } catch (e) {
    console.error(e);
    alert("Wallet connection failed: " + (e.message || e));
  }
};

document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value;
  if (uid) document.getElementById("uid").innerText = "CARV UID: " + uid;

  document.getElementById("result").innerText = "🔍 Scanning soul...";

  setTimeout(() => {
    document.getElementById("result").innerHTML =
      "✅ Soul Score: <b>72</b><br>🧠 Traits: Loyal, Curious, Builder<br>✨ AI Insight: You're a Web3 explorer carving your destiny.";
  }, 1200);
};
