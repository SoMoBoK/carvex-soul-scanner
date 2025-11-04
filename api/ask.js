// api/ask.js
export default async function handler(req, res) {
  try {
    const { wallet, carvUID } = req.body || {};

    const prompt = `
Analyze this user's Web3 profile and identity:
Wallet: ${wallet}
CARV UID: ${carvUID}

Give a short (1-2 sentence), positive, motivating insight about their Web3 journey.
Tone: mixed (mystical + smart + Web3 gamer). Keep it original and concise.
`;

    // Require OPENAI_API_KEY in Vercel env (OPENAI_API_KEY)
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Missing OPENAI_API_KEY" });

    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 120,
        temperature: 0.9
      })
    });

    if (!openaiRes.ok) {
      const errText = await openaiRes.text();
      console.error("OpenAI error:", errText);
      return res.status(502).json({ error: "OpenAI API error" });
    }

    const data = await openaiRes.json();
    const output = data?.choices?.[0]?.message?.content?.trim() || "Your soul echoes with potential. ⚡";

    return res.status(200).json({ answer: output });
  } catch (err) {
    console.error("API handler error:", err);
    return res.status(500).json({ error: "AI server error" });
  }
}
