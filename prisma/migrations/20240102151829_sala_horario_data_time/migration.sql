/*
  Warnings:

  - You are about to drop the column `isAvailable` on the `SalaHorario` table. All the data in the column will be lost.
  - You are about to drop the column `startEndTime` on the `SalaHorario` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `SalaHorario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `SalaHorario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalaHorario" DROP COLUMN "isAvailable",
DROP COLUMN "startEndTime",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;
