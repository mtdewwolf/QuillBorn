export async function scoreContinuity(text: string, context: Record<string, unknown>) {
  const hasConflict = text.toLowerCase().includes("contradiction");
  return {
    score: hasConflict ? 0.4 : 0.9,
    notes: hasConflict ? ["Detected potential contradiction"] : ["No continuity conflicts detected"],
    context
  };
}
