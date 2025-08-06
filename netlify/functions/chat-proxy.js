import fetch from "node-fetch";

export default async (req) => {
  // 👈 ★ NEW  — accept the id sent by the browser
  const { message, assistant } = await req.json();

  // fallback for manual tests without a query-param
  const ASSISTANT_ID = assistant || process.env.DEFAULT_ASSISTANT_ID;

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    method : "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type":  "application/json",
      "OpenAI-Beta":   "assistants=v2"
    },
    body: JSON.stringify({
      model     : "gpt-4o-mini",
      assistant : ASSISTANT_ID,
      messages  : [{ role: "user", content: message }]
    })
  });

  const data  = await resp.json();
  const reply = data.choices?.[0]?.message?.content ?? "No response";

  return new Response(JSON.stringify({ reply }), {
    status : 200,
    headers: { "Content-Type": "application/json" }
  });
};



