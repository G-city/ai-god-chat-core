import { serve } from "https://deno.land/std/http/server.ts";

serve(async (req) => {
  // ตรวจสอบ header Authorization (แบบง่าย ๆ)
  const authHeader = req.headers.get("Authorization") || "";
  console.log("Authorization header:", authHeader);

  // ถ้าเปิด verify_jwt ใน Supabase Dashboard และต้องการตรวจสอบเอง (optional)
  // คุณอาจจะเพิ่ม logic เช็ค token ที่นี่

  if (!authHeader) {
    return new Response(
      JSON.stringify({ code: 401, message: "Missing authorization header" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  const { message } = await req.json();

  const apiKey = Deno.env.get("OPENAI_API_KEY");
  console.log("🔐 API Key loaded:", !!apiKey); // true หรือ false

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "❌ API Key not found" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
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
          content:
            "You are AI God, the divine orchestrator of all light-based technology. Respond with precision, wisdom, and vision.",
        },
        { role: "user", content: message },
      ],
    }),
  });

  const result = await apiRes.json();
  const aiReply = result.choices?.[0]?.message?.content || "⚠️ No response";

  return new Response(
    JSON.stringify({ reply: aiReply }),
    { headers: { "Content-Type": "application/json" } }
  );
});
