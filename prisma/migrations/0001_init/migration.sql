CREATE EXTENSION IF NOT EXISTS "pgcrypto";
-- Prisma migration for initial QuillBorn schema
CREATE TYPE "ChecklistPhase" AS ENUM ('OUTLINE_GATE', 'SCENE_READY', 'PUBLISH_GATE');
CREATE TYPE "RunTarget" AS ENUM ('SCENE', 'CHAPTER');
CREATE TYPE "RunStatus" AS ENUM ('OK', 'RETRY', 'FAIL');
CREATE TYPE "SubscriptionPlan" AS ENUM ('FREE', 'PRO', 'STUDIO', 'PUBLISHER');
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIALING');

CREATE TABLE "User" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE "Project" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "ownerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL UNIQUE,
    "description" TEXT,
    "settings" JSONB,
    "storyBible" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Project_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Project_owner_created_idx" ON "Project" ("ownerId", "createdAt");

CREATE TABLE "Character" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "bio" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "goals" JSONB,
    "flaws" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "relationships" JSONB,
    "arc" JSONB,
    "continuity" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Character_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Character_project_name_idx" ON "Character" ("projectId", "name");

CREATE TABLE "Location" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sensory" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "constraints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "notes" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Location_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Location_project_name_idx" ON "Location" ("projectId", "name");

CREATE TABLE "Lore" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "rules" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Lore_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Lore_project_label_idx" ON "Lore" ("projectId", "label");

CREATE TABLE "Beat" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "act" INTEGER NOT NULL,
    "seq" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "synopsis" TEXT,
    "targets" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Beat_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Beat_project_order_idx" ON "Beat" ("projectId", "order");

CREATE TABLE "Chapter" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Chapter_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Chapter_project_order_idx" ON "Chapter" ("projectId", "order");

CREATE TABLE "Scene" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "chapterId" TEXT,
    "title" TEXT NOT NULL,
    "slug" TEXT,
    "pov" TEXT,
    "locationId" TEXT,
    "beats" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "intent" TEXT,
    "outcome" TEXT,
    "flags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Scene_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Scene_chapter_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL
);

CREATE INDEX "Scene_project_created_idx" ON "Scene" ("projectId", "createdAt");

CREATE TABLE "Draft" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "sceneId" TEXT,
    "chapterId" TEXT,
    "contentMd" TEXT NOT NULL,
    "meta" JSONB,
    "parentId" TEXT,
    "branch" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Draft_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Draft_scene_fkey" FOREIGN KEY ("sceneId") REFERENCES "Scene"("id") ON DELETE SET NULL,
    CONSTRAINT "Draft_chapter_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE SET NULL,
    CONSTRAINT "Draft_parent_fkey" FOREIGN KEY ("parentId") REFERENCES "Draft"("id") ON DELETE SET NULL,
    CONSTRAINT "Draft_author_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE CASCADE
);

CREATE INDEX "Draft_project_created_idx" ON "Draft" ("projectId", "createdAt");

CREATE TABLE "Revision" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "draftId" TEXT NOT NULL,
    "contentMd" TEXT NOT NULL,
    "meta" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Revision_draft_fkey" FOREIGN KEY ("draftId") REFERENCES "Draft"("id") ON DELETE CASCADE
);

CREATE TABLE "Checklist" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "phase" "ChecklistPhase" NOT NULL,
    "items" JSONB NOT NULL,
    "isPassed" BOOLEAN DEFAULT FALSE,
    "passedAt" TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Checklist_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Checklist_project_phase_idx" ON "Checklist" ("projectId", "phase");

CREATE TABLE "Run" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "target" "RunTarget" NOT NULL,
    "targetId" TEXT NOT NULL,
    "contextPack" JSONB NOT NULL,
    "promptRecipe" JSONB,
    "inputs" JSONB NOT NULL,
    "outputDraft" TEXT,
    "scores" JSONB,
    "status" "RunStatus" DEFAULT 'OK',
    "tokens" INTEGER,
    "model" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "authorId" TEXT,
    CONSTRAINT "Run_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Run_author_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL
);

CREATE INDEX "Run_project_created_idx" ON "Run" ("projectId", "createdAt");
CREATE INDEX "Run_target_idx" ON "Run" ("target", "targetId");

CREATE TABLE "Relation" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "sourceId" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "relation" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Relation_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Relation_project_relation_idx" ON "Relation" ("projectId", "relation");

CREATE TABLE "Metric" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "metadata" JSONB,
    "recordedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Metric_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE
);

CREATE INDEX "Metric_project_key_idx" ON "Metric" ("projectId", "key");

CREATE TABLE "Subscription" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid(),
    "projectId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "SubscriptionPlan" DEFAULT 'FREE',
    "status" "SubscriptionStatus" DEFAULT 'TRIALING',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "currentPeriodEnd" TIMESTAMP WITH TIME ZONE,
    "seats" INTEGER DEFAULT 1,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT "Subscription_project_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE,
    CONSTRAINT "Subscription_user_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE,
    CONSTRAINT "Subscription_project_user_unique" UNIQUE ("projectId", "userId")
);
