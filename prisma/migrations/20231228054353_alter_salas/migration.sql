/*
  Warnings:

  - Added the required column `anexavel` to the `Sala` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sala" ADD COLUMN     "anexavel" BOOLEAN NOT NULL;
