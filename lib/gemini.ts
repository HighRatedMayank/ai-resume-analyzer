// lib/gemini.ts
export async function callGemini(prompt: string, modelName = 'models/gemini-2.5-flash') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error('Missing Gemini API key');

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    }
  );

  const json = await res.json();
  if (!res.ok || !json.candidates?.[0]) {
    console.error('Gemini API error:', json);
    throw new Error(`Gemini error: ${json.error?.message || res.statusText}`);
  }

  return json.candidates[0].content.parts[0].text;
}
