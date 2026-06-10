-- Track which requirement values are AI estimates (vs published data) so the
-- UI can label them "(reasonable estimate)" per field.
ALTER TABLE "Program" ADD COLUMN "estimatedFields" TEXT NOT NULL DEFAULT '[]';
