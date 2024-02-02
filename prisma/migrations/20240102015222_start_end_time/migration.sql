/*
  Warnings:

  - You are about to drop the column `endTime` on the `SalaHorario` table. All the data in the column will be lost.
  - You are about to drop the column `startTime` on the `SalaHorario` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SalaHorario" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "startEndTime" TEXT[];
