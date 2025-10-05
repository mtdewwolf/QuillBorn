export type Character = {
  id: string;
  projectId: string;
  name: string;
  role?: string;
  bio?: string;
  tags?: string[];
  goals?: any;
  flaws?: string[];
  relationships?: any;
  arc?: any;
  continuity?: any;
};

export type Location = {
  id: string;
  projectId: string;
  name: string;
  sensory?: string[];
  constraints?: string[];
  notes?: string;
};

export type Lore = {
  id: string;
  projectId: string;
  label: string;
  rules: string[];
};

export type Beat = {
  id: string;
  projectId: string;
  label: string;
  act: number;
  seq: number;
  order: number;
  synopsis?: string;
  targets?: string[];
};

export type Scene = {
  id: string;
  projectId: string;
  chapterId?: string;
  title: string;
  pov?: string;
  locationId?: string;
  beats?: string[];
  intent?: string;
  outcome?: string;
  flags?: string[];
};

export type Draft = {
  id: string;
  projectId: string;
  sceneId?: string;
  chapterId?: string;
  contentMd: string;
  meta?: any;
  parentId?: string;
  branch?: string;
  createdBy: string;
  createdAt: string;
};

export type Checklist = {
  id: string;
  projectId: string;
  phase: "OUTLINE_GATE" | "SCENE_READY" | "PUBLISH_GATE";
  items: any[];
  isPassed: boolean;
  passedAt?: string;
};

export type RunLog = {
  id: string;
  projectId: string;
  target: "SCENE" | "CHAPTER";
  targetId: string;
  contextPack: any;
  promptRecipe: any;
  inputs: any;
  outputDraft?: string;
  scores?: any;
  status: "OK" | "RETRY" | "FAIL";
  tokens?: number;
  model?: string;
  createdAt: string;
};

export type ContextPack = {
  scene: any;
  pov: any;
  characters: any[];
  location: any;
  loreRules: string[];
  styleGuide?: any;
  recap?: string;
  constraints?: string[];
};
