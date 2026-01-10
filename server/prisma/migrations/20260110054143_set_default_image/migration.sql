/*
  Warnings:

  - Made the column `image` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
-- Fill NULL images with default
UPDATE "User"
SET "image" = 'https://res.cloudinary.com/dkwy8fx8o/image/upload/v1768022719/profile_fxdqfj.png'
WHERE "image" IS NULL;

-- Alter column to be non-nullable with default
ALTER TABLE "User"
ALTER COLUMN "image" SET DEFAULT 'https://res.cloudinary.com/dkwy8fx8o/image/upload/v1768022719/profile_fxdqfj.png';
ALTER TABLE "User"
ALTER COLUMN "image" SET NOT NULL;

