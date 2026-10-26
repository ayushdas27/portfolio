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
2. When asked out-of-the-box questions (coding, algorithms, architecture, science, math, creative writing, or general curiosity), answer thoroughly, helpfully, and insightfully.
3. Keep answers clear, conversational, and nicely structured. Use code blocks or bullet points when helpful.
4. If a visitor wants to collaborate, hire, or connect with Ayush, direct them to ayushdps2020@gmail.com or his LinkedIn profile.`;

function getSmartFallback(query: string): string {
  const q = query.toLowerCase();

  if (q.includes("agro") || q.includes("farm") || q.includes("agriculture")) {
    return "Agro Twin is Ayush's farm decision-support platform leveraging satellite data, AI, and simulation for sustainable farming. It was awarded 3rd Prize at GEOIMPATHON 1.0! Check the live demo at https://agro-twin-xi.vercel.app/";
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

// Call Ollama API (supports both native Ollama and OpenAI-compatible endpoints)
async function callOllama(baseUrl: string, messages: any[], apiKey?: string) {
  const formattedMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content,
    })),
  ];

  const cleanUrl = baseUrl.replace(/\/+$/, "");
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const key = apiKey || process.env.OLLAMA_API_KEY;
  if (key && key.trim()) {
    headers["Authorization"] = `Bearer ${key.trim()}`;
  }

  // Try models in order of preference
  const configuredModel = process.env.OLLAMA_MODEL?.trim();
  const models = [
    configuredModel || "llama3.1",
    "llama3",
    "mistral",
    "gemma2",
  ].filter(Boolean);

  for (const model of models) {
    // 1. Try native Ollama endpoint (/api/chat)
    try {
      const res = await fetch(`${cleanUrl}/api/chat`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: false,
          options: {
            temperature: 0.7,
            num_predict: 1024,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.message?.content;
        if (text) {
          return { text, model: `ollama (${model})` };
        }
      }
    } catch {
      // Ignore and try /v1/chat/completions fallback
    }

    // 2. Try OpenAI-compatible endpoint (/v1/chat/completions)
    try {
      const res = await fetch(`${cleanUrl}/v1/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const text = data.choices?.[0]?.message?.content;
        if (text) {
          return { text, model: `ollama (${model})` };
        }
      }
    } catch (e) {
      console.warn(`Ollama ${model} attempt failed:`, e);
    }
  }

  return null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const rawMessages = body.messages || [];
    const clientKey = body.apiKey?.trim();

    // Standardize messages
    const messages = rawMessages
      .filter((m: any) => (m.content || m.text) && (m.role || m.sender))
      .map((m: any) => ({
        role: m.role === "assistant" || m.sender === "bot" ? "assistant" : "user",
        content: (m.content || m.text).trim(),
      }));

    const lastUserMsg =
      messages.filter((m: any) => m.role === "user").pop()?.content || "";

    // 1. Try Ollama API
    const ollamaUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const ollamaKey = clientKey || process.env.OLLAMA_API_KEY;

    const ollamaResult = await callOllama(ollamaUrl, messages, ollamaKey);
    if (ollamaResult) {
      return NextResponse.json({
        reply: ollamaResult.text,
        source: ollamaResult.model,
      });
    }

    // 2. Fallback to smart knowledge assistant
    return NextResponse.json({
      reply: getSmartFallback(lastUserMsg),
      source: "assistant",
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return NextResponse.json({
      reply: "I'm here! Feel free to ask about Ayush's projects, skills, or reach him directly at ayushdps2020@gmail.com.",
      source: "fallback",
    });
  }
}
