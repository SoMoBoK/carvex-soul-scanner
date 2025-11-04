export default async function handler(req, res) {
  try {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
      console.error("❌ No OPENAI_API_KEY found");
      return res.status(500).json({ error: "Missing API key" });
    }

    const { wallet, carvUID } = req.body;

    const prompt = `
You are the CARV Soul Oracle.
Wallet: ${wallet}
CARV UID: ${carvUID}

Give a mystical yet motivational on-chain soul reading.
Short. 1-2 sentences. Web3 vibes.
`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 80,
        temperature: 0.9
      })
    });

    const data = await response.json();
    const answer =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Your soul has whispers of greatness — keep building.";

    return res.status(200).json({ answer });

  } catch (err) {
    console.error("🔥 API errored:", err);
    return res.status(500).json({ answer: "Energy blocked — scan again soon 🌀" });
  }
}
