// Node 18 already provides global `fetch`, so no import needed.

export default async (req, context) => {
  try {
    // Netlify’s ES-module functions have Request-like `req`
    const { message = "Ping?" } = await req.json();

    // *** call OpenAI (or just echo for smoke-test) ***
    // const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {/*…*/});
    // const { choices } = await aiResp.json();
    // const reply = choices?.[0]?.message?.content || "No reply";

    const reply = "Hello from Logic Agency, how are you?";

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


