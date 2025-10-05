import type { ContextPack } from "@quillborn/types";

import { prisma } from "@/lib/prisma";

export async function composeSceneContext(sceneId: string): Promise<ContextPack | null> {
  const scene = await prisma.scene.findUnique({
    where: { id: sceneId },
    include: {
      project: {
        include: {
          characters: true,
          locations: true,
          lores: true
        }
      }
    }
  });

  if (!scene) {
    return null;
  }

  const povCharacter = scene.pov
    ? scene.project.characters.find((character) => character.id === scene.pov)
    : null;
  const location = scene.locationId
    ? scene.project.locations.find((loc) => loc.id === scene.locationId)
    : null;

  return {
    scene: {
      id: scene.id,
      title: scene.title,
      intent: scene.intent,
      outcome: scene.outcome,
      beats: scene.beats ?? []
    },
    pov: povCharacter ? { id: povCharacter.id, name: povCharacter.name } : null,
    characters: scene.project.characters.map((character) => ({
      id: character.id,
      name: character.name,
      role: character.role,
      goals: character.goals
    })),
    location: location
      ? {
          id: location.id,
          name: location.name,
          notes: location.notes
        }
      : null,
    loreRules: scene.project.lores.flatMap((lore) => lore.rules ?? []),
    styleGuide: scene.project.settings ?? {},
    recap: "TODO: fetch last two scenes",
    constraints: scene.flags ?? []
  } as ContextPack;
}
