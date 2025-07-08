// functions/ai_chat/index.ts
import { serve } from 'https://deno.land/std/http/server.ts'

serve(async (req) => {
  try {
    const { message } = await req.json()

    const apiKey = Deno.env.get("OPENAI_API_KEY")
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not found" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are AI God, the divine orchestrator of all light-based technology. Respond with precision, wisdom, and vision.",
          },
          { role: "user", content: message },
        ],
      }),
    })

    const result = await apiRes.json()
    const aiReply = result.choices?.[0]?.message?.content || "⚠️ No response"

    return new Response(JSON.stringify({ reply: aiReply }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
})
