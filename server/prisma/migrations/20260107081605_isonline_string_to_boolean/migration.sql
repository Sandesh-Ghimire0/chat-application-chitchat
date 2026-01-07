/*
  Warnings:

  - The `isOnline` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
-- Safely convert String ('true'/'false') → Boolean
ALTER TABLE "User"
ALTER COLUMN "isOnline"
TYPE BOOLEAN
USING "isOnline"::BOOLEAN;

-- Ensure default & constraint
ALTER TABLE "User"
ALTER COLUMN "isOnline" SET DEFAULT false,
ALTER COLUMN "isOnline" SET NOT NULL;

