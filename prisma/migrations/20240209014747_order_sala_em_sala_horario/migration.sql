/*
  Warnings:

  - You are about to drop the column `orderId` on the `OrderOpcional` table. All the data in the column will be lost.
  - You are about to drop the `_OrderSalaToSalaHorario` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `orderSalaId` to the `OrderOpcional` table without a default value. This is not possible if the table is not empty.
  - Added the required column `orderSalaId` to the `SalaHorario` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrderOpcional" DROP CONSTRAINT "OrderOpcional_orderId_fkey";

-- DropForeignKey
ALTER TABLE "_OrderSalaToSalaHorario" DROP CONSTRAINT "_OrderSalaToSalaHorario_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrderSalaToSalaHorario" DROP CONSTRAINT "_OrderSalaToSalaHorario_B_fkey";

-- AlterTable
ALTER TABLE "OrderOpcional" DROP COLUMN "orderId",
ADD COLUMN     "orderSalaId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SalaHorario" ADD COLUMN     "orderSalaId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_OrderSalaToSalaHorario";

-- AddForeignKey
ALTER TABLE "SalaHorario" ADD CONSTRAINT "SalaHorario_orderSalaId_fkey" FOREIGN KEY ("orderSalaId") REFERENCES "OrderSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOpcional" ADD CONSTRAINT "OrderOpcional_orderSalaId_fkey" FOREIGN KEY ("orderSalaId") REFERENCES "OrderSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
