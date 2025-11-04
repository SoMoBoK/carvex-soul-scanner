async function fetchAI(wallet, uid) {
  try {
    const r = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, carvUID: uid })
    });
    const j = await r.json();
    return j?.answer;
  } catch {
    return null;
  }
}

let addr=null;
const connectBtn=document.getElementById("connectBtn");
const scanBtn=document.getElementById("scanBtn");
const walletText=document.getElementById("walletText");
const wAddrEl=document.getElementById("wAddr");
const uidTextEl=document.getElementById("uidText");
const insightEl=document.getElementById("insightText");
const resultBox=document.getElementById("resultBox");
const shareBtn=document.getElementById("shareBtn");

function getBackpack(){return window.backpack?.solana||window.solana?.isBackpack?window.solana:null}
function getEVM(){return window.ethereum?.isMetaMask?window.ethereum:null}

connectBtn.onclick=async()=>{
  try{
    const b=getBackpack(),e=getEVM(),p=b||e;
    if(!p) return alert("Install Backpack or MetaMask");
    if(p===e){addr=(await p.request({method:"eth_requestAccounts"}))[0]}
    else{const r=await p.connect();addr=r.publicKey?.toString?.()||r}
    walletText.innerText=`Wallet: ${addr}`;
    scanBtn.disabled=false; scanBtn.classList.remove("btn-disabled"); scanBtn.classList.add("btn-primary");
  }catch(e){alert("Wallet connect failed")}
};

scanBtn.onclick=async()=>{
  if(!addr) return alert("Connect wallet first");
  const uid=document.getElementById("carvUid").value||"Not Provided";
  resultBox.style.display="block";
  insightEl.innerHTML="<div class='spinner'></div> Reading soul...";
  wAddrEl.innerText=addr; uidTextEl.innerText=uid;

  const ai = await fetchAI(addr,uid);
  insightEl.innerText = ai || "AI energy low — try again ✨";

  shareBtn.onclick=()=>{
    const short=addr.slice(0,6)+"..."+addr.slice(-4);
    const msg=`I scanned my CARV soul 🔮\n${short}\n${ai||""}\nhttps://carvex-soul-scanner.vercel.app`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`);
  };
};
