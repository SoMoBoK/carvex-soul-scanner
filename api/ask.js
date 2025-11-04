// api/ask.js  — place at repo root inside `api/ask.js` so Vercel exposes /api/ask
export default async function handler(req, res) {
  try {
    const { wallet, carvUID } = req.body || {};
    const key = process.env.OPENAI_API_KEY;
    if (!key) return res.status(500).json({ error: "Missing OPENAI_API_KEY in environment" });

    const prompt = `
You are the CARV Soul Oracle — mix mystical, gamer and Web3 analyst.
User: ${wallet}
CARV UID: ${carvUID}

Write a short 1-2 sentence motivating insight interpreting the user's on-chain identity.
Tone: mixed (mystical + analytical + Web3 energy). Keep it concise.
Return only the insight text.
`;

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${key}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
        temperature: 0.9
      })
    });

    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      console.error("OpenAI error:", txt);
      return res.status(502).json({ error: "OpenAI error" });
    }

    const data = await openaiRes.json();
    const answer = data?.choices?.[0]?.message?.content?.trim() || null;
    return res.status(200).json({ answer: answer || "Your soul echoes potential — stay curious." });
  } catch (err) {
    console.error("api/ask error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
