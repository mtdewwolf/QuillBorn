import type { ContextPack } from "@quillborn/types";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function generateSceneDraft(contextPack: ContextPack): Promise<string> {
  if (!process.env.OPENROUTER_API_KEY) {
    return mockDraft(contextPack);
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + process.env.OPENROUTER_API_KEY,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
        "X-Title": "QuillBorn"
      },
      body: JSON.stringify({
        model: "openai/gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are the QuillBorn Scene Crafter. Produce markdown scenes that honour constraints and continuity."
          },
          {
            role: "user",
            content: JSON.stringify(contextPack)
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error("OpenRouter request failed" + response.statusText);
    }

    const payload: any = await response.json();
    const text = payload.choices?.[0]?.message?.content;
    if (typeof text === "string" && text.length > 0) {
      return text;
    }
  } catch (error) {
    console.error("OpenRouter fallback", error);
  }

  return mockDraft(contextPack);
}

function mockDraft(contextPack: ContextPack): string {
  const sceneTitle = contextPack.scene?.title ?? "Untitled Scene";
  const pov = contextPack.pov?.character ?? "Unknown POV";
  const beatsSource = Array.isArray((contextPack.scene as any)?.beats)
    ? ((contextPack.scene as any).beats as string[])
    : [];
  const beatList = beatsSource
    .map((beat, index) => "- Beat " + String(index + 1) + ": " + beat)
    .join("\n");

  return [
    "## " + sceneTitle,
    "",
    "**POV:** " + pov,
    "",
    "The rain-slick alley hums with tension as the QuillBorn demo scene unfolds.",
    "Aria measures every shadow, recalling the project lore and strict canon rules.",
    "",
    "### Beats",
    beatList || "- Establish conflict\n- Reveal twist",
    "",
    "---",
    "_This draft was generated in mock mode. Set OPENROUTER_API_KEY to enable live generations._"
  ].join("\n");
}
