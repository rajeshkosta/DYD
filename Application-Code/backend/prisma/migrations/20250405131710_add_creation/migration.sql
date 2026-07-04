/*
  Warnings:

  - You are about to drop the column `images` on the `Creation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Creation" DROP COLUMN "images",
ADD COLUMN     "image" TEXT;
