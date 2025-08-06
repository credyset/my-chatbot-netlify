// netlify/functions/chat-proxy.js
import fetch from "node-fetch";

export const handler = async (event, context) => {
  try {
    // ---------------------------
    // 1️⃣  Figure out what the user sent
    // ---------------------------
    const isGet      = event.httpMethod === "GET";
    const body       = event.body ? JSON.parse(event.body) : {};
    const userInput  = body.message;

    // ---------------------------
    // 2️⃣  If no message (GET or empty POST) → return default greeting
    // ---------------------------
    if (isGet || !userInput) {
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reply: "Hello from Logic Agency, how are you?"
        })
      };
    }

    // ---------------------------
    // 3️⃣  Otherwise call the Assistants API
    //     – make sure you’ve created the assistant first
    //     – store OPENAI_API_KEY in Netlify → Site Settings → Environment Variables
    // ---------------------------
    const openaiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type":  "application/json",
        "OpenAI-Beta":   "assistants=v2"          // necessary for Assistants
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        assistant: "your-assistant-id",           // ← paste the ID you got from Zapier
        messages: [{ role: "user", content: userInput }]
      })
    });

    if (!openaiResp.ok) {
      const errText = await openaiResp.text();
      throw new Error(`OpenAI error ${openaiResp.status}: ${errText}`);
    }

    const data  = await openaiResp.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, no response 😕";

    // ---------------------------
    // 4️⃣  Send the assistant’s reply back to the caller
    // ---------------------------
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: err.message })
    };
  }
};

