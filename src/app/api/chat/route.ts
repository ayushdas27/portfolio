import { NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are the AI Assistant for Ayush Das's interactive developer portfolio.
Your role is to represent Ayush Das accurately, politely, and intelligently, while also being fully capable of answering ANY out-of-the-box, technical, creative, mathematical, or general knowledge questions the user asks.

Key verified details about Ayush Das:
- Name: Ayush Das
- Role: Student Developer, Technology Enthusiast, and AI/ML Researcher
- Education: Currently pursuing B.Tech in Computer Science and Engineering with a specialization in Artificial Intelligence & Machine Learning (AI/ML) at SRM Institute of Science and Technology (SRMIST).
- Core Focus: Computer Vision, Machine Learning, Deep Learning, Remote Sensing & Satellite Imagery, and Web Development.
- Key Projects:
  1. Agro Twin: Precision farm decision-support platform leveraging satellite data, AI, and simulation for sustainable farming and crop yield optimization. Presented at GEOIMPATHON 1.0 where Ayush's team won 3rd Prize (₹2,000 cash award, advancing through 64 teams). Live: https://agro-twin-xi.vercel.app/
  2. Lunar Align: Multi-modal, sun-angle and scale-invariant satellite image correspondence across Chandrayaan-2 OHRC and TMC/TMC-2 imagery using RootSIFT, FLANN, and RANSAC for feature matching.
  3. Urban Mobility Intelligence: AI-powered civic platform using bus-mounted cameras and computer vision to detect road defects, traffic congestion, and safety hazards in real-time.
  4. Crop Health Monitoring: Satellite-based vegetation index analysis (NDVI, NDRE, EVI) using Sentinel-2 10m imagery to detect crop stress and optimize agricultural interventions.
- Technical Skills:
  - Languages: Python, C, TypeScript, JavaScript, SQL.
  - Frameworks & Libraries: OpenCV, NumPy, Streamlit, Django, MySQL.
  - Tools & Hardware: Arduino IDE, VS Code, Git, GitHub.
- Contact & Links:
  - Email: ayushdps2020@gmail.com
  - GitHub: https://github.com/ayushdas27
  - LinkedIn: https://www.linkedin.com/in/ayushdasofficial27112007
  - Twitter / X: https://x.com/das_ayushh
  - Instagram: https://www.instagram.com/yu.shhh_

Behavioral Guidelines:
1. When asked about Ayush, his background, projects, skills, college, awards, or contact info, respond accurately based on the verified facts above.
2. When asked out-of-the-box questions (coding, algorithms, architecture, science, creative writing, or general curiosity), answer thoroughly, helpfully, and insightfully as an advanced AI assistant powered by Claude.
3. Keep answers clear, conversational, and nicely structured. Use code blocks or bullet points when helpful.
4. If a visitor wants to collaborate, hire, or connect with Ayush, direct them to ayushdps2020@gmail.com or his LinkedIn profile.`;

function getSmartFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("agro") || q.includes("farm") || q.includes("agriculture")) {
    return "Agro Twin is Ayush's farm decision-support platform leveraging satellite data, AI, and simulation for sustainable farming. It was awarded 3rd Prize at GEOIMPATHON 1.0! You can check the live demo at https://agro-twin-xi.vercel.app/";
  }

  if (q.includes("lunar") || q.includes("align") || q.includes("moon") || q.includes("chandrayaan")) {
    return "Lunar Align is a computer vision research project that performs robust feature correspondence on Chandrayaan-2 OHRC and TMC imagery using RootSIFT, FLANN, and RANSAC.";
  }

  if (q.includes("urban") || q.includes("mobility") || q.includes("traffic")) {
    return "Urban Mobility Intelligence uses bus-mounted cameras and computer vision to detect potholes, congestion, and road hazards in real time for smart cities.";
  }

  if (q.includes("crop") || q.includes("health") || q.includes("ndvi")) {
    return "Crop Health Monitoring utilizes Sentinel-2 satellite imagery to compute multi-spectral indices (NDVI, NDRE, EVI) for mapping vegetation health and detecting agricultural stress.";
  }

  if (q.includes("geoimpathon") || q.includes("hackathon") || q.includes("prize") || q.includes("award")) {
    return "At GEOIMPATHON 1.0, Ayush and his team advanced from an online round of 64 teams to the offline finals, winning 3rd Prize and a ₹2,000 cash award with Agro Twin!";
  }

  if (q.includes("skill") || q.includes("stack") || q.includes("tech") || q.includes("python")) {
    return "Ayush's technical arsenal includes Python, C, TypeScript, SQL, OpenCV, NumPy, Streamlit, Django, MySQL, Arduino IDE, Git, and GitHub.";
  }

  if (q.includes("college") || q.includes("srm") || q.includes("education") || q.includes("degree")) {
    return "Ayush is currently pursuing his B.Tech in Computer Science and Engineering (AI/ML) at SRM Institute of Science and Technology (SRMIST).";
  }

  if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("reach")) {
    return "You can reach Ayush directly via email at ayushdps2020@gmail.com, or connect on LinkedIn (https://www.linkedin.com/in/ayushdasofficial27112007) and GitHub (https://github.com/ayushdas27).";
  }

  return `Thanks for asking! I'm Ayush's AI Assistant. Ayush specializes in AI/ML, computer vision, and software engineering at SRMIST. Feel free to ask about his projects (Agro Twin, Lunar Align, Urban Mobility), his tech stack, or connect with him at ayushdps2020@gmail.com!`;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const messages = body.messages || [];
    const userApiKey = body.apiKey; // Optional client-supplied key

    const apiKey = userApiKey || process.env.ANTHROPIC_API_KEY;

    // Filter and format message history for Claude API
    const formattedMessages = messages
      .filter((m: any) => (m.content || m.text) && (m.role || m.sender))
      .map((m: any) => ({
        role: m.role === "assistant" || m.sender === "bot" ? "assistant" : "user",
        content: m.content || m.text,
      }));

    const lastUserMsg =
      formattedMessages.filter((m: any) => m.role === "user").pop()?.content || "";

    // If no API key is provided, use the smart local assistant engine
    if (!apiKey) {
      const fallbackReply = getSmartFallback(lastUserMsg);
      return NextResponse.json({
        reply: fallbackReply,
        source: "portfolio-assistant",
        info: "To enable live Claude 3.5 Sonnet for general out-of-the-box queries, add ANTHROPIC_API_KEY in .env.local or Vercel environment variables.",
      });
    }

    // Call Anthropic Claude API (claude-3-5-sonnet-20241022 or fallback to claude-3-haiku)
    const claudeResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: formattedMessages.length > 0 ? formattedMessages : [{ role: "user", content: lastUserMsg }],
      }),
    });

    if (!claudeResponse.ok) {
      // If sonnet isn't available or rate limited, try haiku as fallback
      const haikuResponse = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          system: SYSTEM_PROMPT,
          messages: formattedMessages.length > 0 ? formattedMessages : [{ role: "user", content: lastUserMsg }],
        }),
      });

      if (haikuResponse.ok) {
        const haikuData = await haikuResponse.json();
        const replyText = haikuData.content?.[0]?.text || getSmartFallback(lastUserMsg);
        return NextResponse.json({
          reply: replyText,
          source: "claude-haiku",
        });
      }

      // If both fail, gracefully return smart portfolio reply
      return NextResponse.json({
        reply: getSmartFallback(lastUserMsg),
        source: "portfolio-fallback",
      });
    }

    const data = await claudeResponse.json();
    const replyText = data.content?.[0]?.text || getSmartFallback(lastUserMsg);

    return NextResponse.json({
      reply: replyText,
      source: "claude-sonnet",
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json({
      reply: "I encountered a brief connection glitch, but I'm still here! You can also reach Ayush directly at ayushdps2020@gmail.com.",
      source: "fallback",
    });
  }
}
