/*
  Warnings:

  - Made the column `authorId` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "authorId" SET NOT NULL;

-- Could use this logic for paritioning
-- CREATE TABLE "Post_2024" PARTITION OF "Post"
--     FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');
