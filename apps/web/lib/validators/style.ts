export async function scoreStyle(text: string) {
  const length = text.length;
  const pacing = length > 500 ? "expansive" : "tight";
  return {
    score: 0.8,
    pacing,
    tone: text.includes("!"),
    notes: ["Style validator stub"],
    sample: text.slice(0, 140)
  };
}
