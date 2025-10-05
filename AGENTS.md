🧠 AGENTS.md — QuillBorn AI System Architecture

“A story is born through cooperation — not chaos.”

📜 Overview

QuillBorn uses a modular agent architecture to maintain narrative consistency, structure, and creativity across long-form writing projects.

Each Agent is an independent reasoning unit specializing in one area of the writing process (e.g., character development, continuity validation, tone enforcement).
Agents communicate via structured data — not raw text — ensuring coherent context, repeatable results, and safe delegation.

🧩 Core Agent Types
Agent	Role	Input	Output
🪶 Narrative Architect	Designs the high-level story structure and ensures alignment with user goals	Genre, Theme, World Rules	Act structure, Beat sequence, Plot outline
👤 Character Weaver	Develops consistent, evolving characters with dynamic arcs and motivations	Character sheet, relationships, story beats	Character updates, continuity notes
🌍 World Curator	Maintains internal world logic and lore canon	Locations, rules, magic systems, culture files	CanonFacts (world laws, constraints)
🧠 Context Composer	Builds contextual packets for AI generation (ContextPacks)	Scene ID, linked beats, characters, lore	Structured ContextPack JSON
✍️ Scene Crafter	Generates scenes using ContextPacks and validator feedback	ContextPack, Beat	SceneDraft (markdown text + meta)
🧩 Continuity Validator	Checks for logical consistency across scenes and canon	SceneDraft, CanonFacts	Boolean + error list
💬 Style & Voice Agent	Enforces stylistic coherence, pacing, and tone per author style or genre	SceneDraft, StyleGuide	Style report + recommendations
🧾 Critique & Editor Agent	Acts as a creative editor, providing narrative feedback and improvement suggestions	SceneDraft, Validation results	Revision suggestions, scores
💡 Knowledge Curator	Updates the StoryGraph with newly confirmed canon or relationships	SceneDraft, CanonFacts	Updated story knowledge graph
💰 Publishing Agent	Handles export and metadata prep for DOCX/EPUB publishing	Final draft, Metadata	Publish-ready file
🧠 Agent Hierarchy
flowchart TD
    A[User] --> B[Narrative Architect]
    B --> C[Character Weaver]
    B --> D[World Curator]
    C --> E[Context Composer]
    D --> E
    E --> F[Scene Crafter]
    F --> G[Continuity Validator]
    F --> H[Style & Voice Agent]
    G --> I[Critique & Editor Agent]
    H --> I
    I --> J[Knowledge Curator]
    J --> K[Publishing Agent]

🧬 Data Models

Each agent communicates using typed JSON payloads, ensuring safe AI-to-AI interactions.

🎭 Example: ContextPack
{
  "scene": {
    "id": "scn_1",
    "title": "The Meeting in the Alley",
    "intent": "Reveal betrayal",
    "location": "Back alley, rain-soaked"
  },
  "pov": { "character": "Aria Novak", "emotion": "tense" },
  "characters": [
    { "name": "Aria Novak", "goal": "Survive", "conflict": "Trust issues" },
    { "name": "Marcus Vale", "goal": "Expose Aria", "conflict": "Loyalty vs duty" }
  ],
  "lore": ["Pirate Code forbids betrayal", "Crimson Dawn controls the docks"],
  "style": { "tone": "gritty", "pacing": "tight" },
  "recap": "Aria evaded capture but lost her ship."
}

⚙️ Agent Interaction Protocols
🪶 1. Narrative Cycle

Each story iteration passes through this cycle:

Narrative Architect defines structure

Character Weaver + World Curator update canonical data

Context Composer assembles relevant context

Scene Crafter writes the scene

Validators check output for continuity and style

Critique Agent suggests revisions

Knowledge Curator updates the story graph

Publishing Agent formats and exports

🔁 2. Feedback Loops

Agents share scorecards (0–1) for continuity, pacing, style, and emotional resonance.

These are aggregated into a SceneScore used by the Scene Crafter for self-improvement (RLHF-like feedback loop).

🧾 3. Agent Messaging Format

All communication uses structured payloads via in-memory message bus (or Supabase RPCs).

{
  "from": "ContinuityValidator",
  "to": "SceneCrafter",
  "type": "feedback",
  "payload": {
    "sceneId": "scn_01",
    "issues": [
      "Character motivation conflicts with established lore",
      "Setting time inconsistent with previous chapter"
    ],
    "suggestions": "Reframe the motivation or clarify time passage."
  }
}

🧩 Validation Agents (Specialized Subsystems)
Validator	Description	Example Failure
ContinuityValidator	Checks character, location, and timeline consistency	Aria alive in Scene 4 after dying in Scene 3
ToneValidator	Ensures stylistic and emotional tone consistency	Comedic tone in a horror chapter
CanonValidator	Confirms adherence to world rules	Use of forbidden magic
POVValidator	Checks for POV violations and narrative flow	Sudden switch from first to third person
StructureValidator	Ensures beats match structural goals	Missing “climax” beat in Act 3
EthicsValidator	Enforces safety and sensitivity guidelines	Harmful or explicit themes
📚 Persistent Knowledge System
Component	Purpose
StoryGraph	Directed graph connecting all entities (Character, Scene, Location, Lore, Beat)
CanonFacts	Validated world truths stored as key-value pairs or embeddings
ContextCache	Pre-composed ContextPacks cached for quick retrieval
RunLogs	Every AI operation logged for replayability and debugging
🧱 Integration with Backend
Feature	Description
Agent Hosting	Each agent runs as a Vercel Edge Function or Supabase Function
Routing	Requests handled via api/agents/[name]/route.ts
Logging	All agent actions recorded in the Run table (inputs, outputs, scores, model, status)
Orchestration	Managed via lightweight dispatcher (future upgrade: async queue system)
🪙 Future Agents (Planned)
Agent	Purpose
🗣️ Dialogue Polisher	Refines natural dialogue per character personality
🧾 Plot Therapist	Detects narrative tension dips and suggests fixes
🎭 Emotion Mapper	Charts emotional arcs per scene
🧬 AI Trainer Agent	Monitors feedback and adjusts prompt weights
🧰 Debug Agent	Observes system health, retries, and token efficiency
🧭 Agent Principles

Structure First — All creativity flows from defined constraints.

Continuity Above All — No scene breaks canon.

Collaborative Intelligence — Each agent improves the next.

Transparent Communication — Every AI action is logged and reviewable.

Human Supervision — The author retains final authority.

🪶 Example Workflow — Scene Generation

User completes “Scene Checklist.”

Context Composer builds contextual snapshot.

Scene Crafter drafts the scene.

ContinuityValidator + StyleAgent score it.

If below threshold → CritiqueAgent refines draft.

Knowledge Curator stores final scene canon.

Scene is approved or edited manually by user.

🧩 Implementation References
Path	Purpose
packages/agents/	Agent logic and stubs
lib/context/composeScene.ts	Builds ContextPack for SceneCrafter
lib/validators/	Modular validator framework
api/agents/*	Serverless endpoints per agent
prisma/schema.prisma	Tables for RunLogs, CanonFacts, SceneScores
📜 License & Safety

All agents follow QuillBorn’s Ethical AI Charter:

Never generate harmful, explicit, or discriminatory content

Always operate under explicit user permission

All data for model improvement is anonymized

“The quill writes many hands’ stories — but only through structure does the story endure.”