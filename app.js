// Backpack wallet logic
let walletAddress = null;

function getBackpackProvider() {
  if (window.backpack) return window.backpack;
  if (window.Backpack) return window.Backpack;
  if (window.solana && window.solana.isBackpack) return window.solana;
  return null;
}

// Connect Wallet
document.getElementById("connectBtn").onclick = async () => {
  const provider = getBackpackProvider();
  if (!provider) {
    alert("Backpack wallet not detected. Please install or enable Backpack.");
    return;
  }

  try {
    let res;
    if (provider.connect) res = await provider.connect();
    else if (provider.request) res = await provider.request({ method: "connect" });
    else throw new Error("Unsupported Backpack provider");

    const pub = res?.publicKey?.toString() || (res?.[0]?.toString());
    if (!pub) throw new Error("No public key returned");

    walletAddress = pub;
    document.getElementById("wallet").innerText = "Wallet: " + walletAddress;
    document.getElementById("scanBtn").disabled = false;

  } catch (e) {
    console.error(e);
    alert("Wallet connection failed: " + (e.message || e));
  }
};

// Fetch CARV Profile
async function getCarvProfile(uid) {
  try {
    const res = await fetch(`https://api.carv.io/v1/profile/${uid}`);
    const data = await res.json();

    if (data?.data) {
      document.getElementById("carvProfile").style.display = "block";
      document.getElementById("carvAvatar").src = data.data.avatar;
      document.getElementById("carvName").innerText = data.data.username;
    }
  } catch (err) {
    console.log("CARV API Error:", err);
  }
}

// Scan Soul Button
document.getElementById("scanBtn").onclick = async () => {
  const uid = document.getElementById("carvUid").value;

  if (uid) {
    document.getElementById("uid").innerText = "CARV UID: " + uid;
    await getCarvProfile(uid);
  }

  document.getElementById("result").innerText = "🔍 Scanning soul...";

  setTimeout(() => {
    document.getElementById("result").innerHTML =
      "✅ Soul Score: <b>72</b><br>🧠 Traits: Loyal, Curious, Builder<br>✨ AI Insight: You're a Web3 explorer carving your destiny.";
  }, 1200);
};
