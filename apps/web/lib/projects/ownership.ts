import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

interface OwnershipError {
  ok: false;
  status: number;
  error: string;
}

type SimpleOwnershipResult = { ok: true } | OwnershipError;

const UNAUTHORIZED: OwnershipError = { ok: false, status: 401, error: "unauthorized" };

export async function verifyProjectOwnership(
  projectId: string,
  userId: string | undefined | null
): Promise<SimpleOwnershipResult> {
  if (!userId) {
    return UNAUTHORIZED;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true }
  });

  if (!project) {
    return { ok: false, status: 404, error: "project_not_found" };
  }

  if (project.ownerId !== userId) {
    return { ok: false, status: 403, error: "forbidden" };
  }

  return { ok: true };
}

type OwnershipResult<T> = { ok: true; record: T } | OwnershipError;

async function assertEntityOwnership<T extends { project: { ownerId: string } }>(
  entity: T | null,
  userId: string | undefined | null
): Promise<OwnershipResult<Omit<T, "project">>> {
  if (!userId) {
    return UNAUTHORIZED;
  }

  if (!entity) {
    return { ok: false, status: 404, error: "not_found" };
  }

  if (entity.project.ownerId !== userId) {
    return { ok: false, status: 403, error: "forbidden" };
  }

  const { project, ...record } = entity;
  return { ok: true, record };
}

type CharacterWithProject = Prisma.CharacterGetPayload<{ include: { project: { select: { ownerId: true } } } }>;
type SceneWithProject = Prisma.SceneGetPayload<{ include: { project: { select: { ownerId: true } } } }>;
type LocationWithProject = Prisma.LocationGetPayload<{ include: { project: { select: { ownerId: true } } } }>;
type BeatWithProject = Prisma.BeatGetPayload<{ include: { project: { select: { ownerId: true } } } }>;

export async function verifyCharacterOwnership(
  characterId: string,
  userId: string | undefined | null
): Promise<OwnershipResult<Omit<CharacterWithProject, "project">>> {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: { project: { select: { ownerId: true } } }
  });

  return assertEntityOwnership(character, userId);
}

export async function verifySceneOwnership(
  sceneId: string,
  userId: string | undefined | null
): Promise<OwnershipResult<Omit<SceneWithProject, "project">>> {
  const scene = await prisma.scene.findUnique({
    where: { id: sceneId },
    include: { project: { select: { ownerId: true } } }
  });

  return assertEntityOwnership(scene, userId);
}

export async function verifyLocationOwnership(
  locationId: string,
  userId: string | undefined | null
): Promise<OwnershipResult<Omit<LocationWithProject, "project">>> {
  const location = await prisma.location.findUnique({
    where: { id: locationId },
    include: { project: { select: { ownerId: true } } }
  });

  return assertEntityOwnership(location, userId);
}

export async function verifyBeatOwnership(
  beatId: string,
  userId: string | undefined | null
): Promise<OwnershipResult<Omit<BeatWithProject, "project">>> {
  const beat = await prisma.beat.findUnique({
    where: { id: beatId },
    include: { project: { select: { ownerId: true } } }
  });

  return assertEntityOwnership(beat, userId);
}
