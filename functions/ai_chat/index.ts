import "jsr:@supabase/functions-js/edge-runtime.d.ts";
console.log("Hello from Functions!");

Deno.serve(async (req) => {
  try {
    const { message } = await req.json();

    // ---- ถ้าเอาไปต่อ OpenAI — ใน dev ให้ข้ามเช็ค auth ไปก่อน! ----
    // แบบนี้ใครก็ยิงได้ เฉพาะในทดสอบเท่านั้น

    // <-- ถ้าอยากใส่ auth: ดู comment ด้านล่าง -->

    // *** เรียก OpenAI API (เปลี่ยนตรงนี้ตามต้องการ) ***
    // หรือจะใส่โค้ดคงที่ตรงนี้เพื่อทดสอบก่อน
    // const aiReply = `คุณส่งข้อความ: ${message}`; // สำหรับ debug ธรรมดา
    // หรือถ้ามี apiKey ให้เรียก API จริงด้านล่าง

    const apiKey = Deno.env.get("OPENAI_API_KEY");

    // เรียกไปที่ OpenAI (เหมือนไฟล์ใน github)
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
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid request" }),
      { status: 400, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  }
});
