export type PlanId = "FREE" | "PRO" | "STUDIO" | "PUBLISHER";

export interface Plan {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "FREE",
    name: "Free",
    price: "/bin/bash",
    features: ["Single project", "Mocked AI runs", "Community validators"]
  },
  {
    id: "PRO",
    name: "Pro",
    price: "9",
    features: ["Unlimited projects", "Live OpenRouter", "Stripe billing"]
  },
  {
    id: "STUDIO",
    name: "Studio",
    price: "9",
    features: ["Team workspace", "Story ops automations", "Langfuse analytics"]
  },
  {
    id: "PUBLISHER",
    name: "Publisher",
    price: "99",
    features: ["Org workspaces", "Custom validators", "Priority support"]
  }
];

export function getPlan(planId: PlanId) {
  return PLANS.find((plan) => plan.id === planId) ?? PLANS[0];
}

export function canAccessFeature(planId: PlanId, feature: string) {
  if (planId === "FREE") {
    return feature === "mock" || feature === "basic";
  }
  if (planId === "PRO" && feature === "studio-only") {
    return false;
  }
  return true;
}

export function requireFeature(planId: PlanId, feature: string) {
  const allowed = canAccessFeature(planId, feature);
  if (!allowed) {
    throw new Error("Plan " + planId + " does not allow feature " + feature);
  }
}
