/*
  Warnings:

  - You are about to drop the column `salaHorarioIds` on the `OrderSala` table. All the data in the column will be lost.
  - You are about to drop the column `orderSalaId` on the `SalaHorario` table. All the data in the column will be lost.
  - You are about to drop the `Reserva` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ReservaToSalaHorario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Reserva" DROP CONSTRAINT "Reserva_orderId_fkey";

-- DropForeignKey
ALTER TABLE "SalaHorario" DROP CONSTRAINT "SalaHorario_orderSalaId_fkey";

-- DropForeignKey
ALTER TABLE "_ReservaToSalaHorario" DROP CONSTRAINT "_ReservaToSalaHorario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ReservaToSalaHorario" DROP CONSTRAINT "_ReservaToSalaHorario_B_fkey";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "totalPrice" DECIMAL(8,2) NOT NULL;

-- AlterTable
ALTER TABLE "OrderSala" DROP COLUMN "salaHorarioIds",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SalaHorario" DROP COLUMN "orderSalaId";

-- DropTable
DROP TABLE "Reserva";

-- DropTable
DROP TABLE "_ReservaToSalaHorario";

-- CreateTable
CREATE TABLE "_OrderSalaToSalaHorario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OrderSalaToSalaHorario_AB_unique" ON "_OrderSalaToSalaHorario"("A", "B");

-- CreateIndex
CREATE INDEX "_OrderSalaToSalaHorario_B_index" ON "_OrderSalaToSalaHorario"("B");

-- AddForeignKey
ALTER TABLE "_OrderSalaToSalaHorario" ADD CONSTRAINT "_OrderSalaToSalaHorario_A_fkey" FOREIGN KEY ("A") REFERENCES "OrderSala"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrderSalaToSalaHorario" ADD CONSTRAINT "_OrderSalaToSalaHorario_B_fkey" FOREIGN KEY ("B") REFERENCES "SalaHorario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
