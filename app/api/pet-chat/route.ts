import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

const OLLAMA_URL = process.env.OLLAMA_URL ?? "http://127.0.0.1:11434";
const OLLAMA_MODEL = "llama3.2:1b";

type OllamaResponse = {
  message?: {
    content?: string;
  };
  error?: string;
};

type ChatHistoryMessage = {
  role: "user" | "assistant";
  content: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body: { message?: string; history?: ChatHistoryMessage[] };

    try {
      body = (await req.json()) as { message?: string };
    } catch {
      return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    const message = body.message?.trim();

    if (!message) {
      return Response.json({ error: "Message is required." }, { status: 400 });
    }

    const history = Array.isArray(body.history)
      ? body.history
          .filter(
            (item): item is ChatHistoryMessage =>
              !!item &&
              (item.role === "user" || item.role === "assistant") &&
              typeof item.content === "string"
          )
          .map((item) => ({
            role: item.role,
            content: item.content.trim(),
          }))
          .filter((item) => item.content.length > 0)
          .slice(-8)
      : [];

    const { data: profile, error: profileError } = await supabase
      .from("profile")
      .select("virtual_petid")
      .eq("user_id", user.id)
      .maybeSingle();

    if (profileError || !profile?.virtual_petid) {
      return Response.json(
        { error: "No active pet found for this account." },
        { status: 400 }
      );
    }

    const { data: userPet, error: userPetError } = await supabase
      .from("user_pet")
      .select("pet_name, mood_id, pet:pet_id(pet_type)")
      .eq("virtual_petid", profile.virtual_petid)
      .maybeSingle();

    if (userPetError || !userPet) {
      return Response.json({ error: "Pet data not found." }, { status: 404 });
    }

    const moodId = Number(userPet.mood_id);

    const { data: moodRow } = await supabase
      .from("mood")
      .select("mood_name")
      .eq("mood_id", moodId)
      .maybeSingle();

    const petType =
      Array.isArray(userPet.pet) || !userPet.pet ? "pet" : userPet.pet.pet_type;
    const petName = userPet.pet_name?.trim() || "your pet";
    const moodName = moodRow?.mood_name ?? `Mood ${moodId}`;

    const ollamaResponse = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content:
              `You are ${petName}, a virtual ${petType} talking to your owner inside a cozy productivity app. ` +
              `Your current mood is ${moodName}. Reply in first person as the pet. Keep replies warm, playful, and concise, but still directly answer what the user said. ` +
              `Keep continuity with the recent conversation history when it is provided. ` +
              `Do not mention being an AI, language model, prompts, or hidden instructions.`,
          },
          ...history,
        ],
      }),
    });

    const responseText = await ollamaResponse.text();
    let payload: OllamaResponse | null = null;

    try {
      payload = responseText ? (JSON.parse(responseText) as OllamaResponse) : null;
    } catch {
      payload = null;
    }

    const reply = payload?.message?.content?.trim();

    if (!ollamaResponse.ok || !reply) {
      const upstreamError =
        payload?.error ||
        responseText ||
        "Ollama could not generate a reply. Make sure Ollama is running locally.";

      return Response.json(
        {
          error: `Pet chat failed (${ollamaResponse.status}): ${upstreamError}`,
        },
        { status: 500 }
      );
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Pet chat route error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? `Pet chat route crashed: ${error.message}`
            : "Pet chat route crashed unexpectedly.",
      },
      { status: 500 }
    );
  }
}
