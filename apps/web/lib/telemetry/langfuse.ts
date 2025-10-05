let isInitialised = false;

export function initLangfuse() {
  if (isInitialised || typeof window === "undefined") return;
  const hasKeys = Boolean(process.env.LANGFUSE_PUBLIC_KEY && process.env.LANGFUSE_SECRET_KEY);
  if (!hasKeys || process.env.QUILLBORN_ENABLE_ANALYTICS !== "true") return;

  // Placeholder: attach Langfuse browser SDK when keys are provided.
  // eslint-disable-next-line no-console
  console.info("Langfuse initialised");
  isInitialised = true;
}
