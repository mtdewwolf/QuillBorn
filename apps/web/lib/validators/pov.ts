export async function scorePOV(text: string, pov: { character?: string | null }) {
  const firstPerson = text.includes(" I ") || text.trim().startsWith("I");
  return {
    score: firstPerson ? 0.7 : 0.9,
    pov: pov?.character ?? "unknown",
    notes: ["POV validator stub"],
    detected: firstPerson ? "first" : "third"
  };
}
