/*
  Warnings:

  - You are about to drop the column `name` on the `Users` table. All the data in the column will be lost.
  - Added the required column `car` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gamertag` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" DROP COLUMN "name",
ADD COLUMN     "car" TEXT NOT NULL,
ADD COLUMN     "gamertag" TEXT NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 1;
