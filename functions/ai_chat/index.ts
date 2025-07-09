// functions/ai_chat/index.ts
import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  const { message } = await req.json();

  const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");

  // ตรวจสอบว่าคีย์ถูกโหลดมาหรือไม่
  console.log("🔑 API KEY: ", OPENAI_API_KEY ? "Loaded" : "Not Found");

  if (!OPENAI_API_KEY) {
    return new Response(JSON.stringify({ error: "❌ Missing OPENAI_API_KEY" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const apiRes = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are AI God, the divine orchestrator of all light-based technology. Respond with precision, wisdom, and vision.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  const result = await apiRes.json();

  const aiReply = result.choices?.[0]?.message?.content || "⚠️ No response";

  return new Response(JSON.stringify({ reply: aiReply }), {
    headers: { "Content-Type": "application/json" },
  });
});
