export async function scorePace(text: string) {
  const sentences = text.split(/[.!?]/).filter((segment) => segment.trim().length > 0);
  return {
    score: sentences.length > 6 ? 0.85 : 0.6,
    sentences: sentences.length,
    notes: ["Pace validator stub"],
    recommendation: sentences.length > 6 ? "Maintain rhythm" : "Add more sensory detail"
  };
}
