// netlify/functions/chat-proxy.js
import fetch from "node-fetch";

export default async (req, context) => {
  try {
    const { message } = await req.json();          // POST body: { "message": "hi" }

    const resp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
        "OpenAI-Beta": "assistants=v2"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        assistant: "your-assistant-id",
        messages: [{ role: "user", content: message }]
      })
    });

    const data = await resp.json();
    const reply = data.choices?.[0]?.message?.content || "Sorry, no response";

    return new Response(
      JSON.stringify({ reply }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
