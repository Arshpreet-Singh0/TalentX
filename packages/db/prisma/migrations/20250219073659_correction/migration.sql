/*
  Warnings:

  - You are about to drop the column `liveyrl` on the `Project` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Project" DROP COLUMN "liveyrl",
ADD COLUMN     "liveurl" TEXT;
