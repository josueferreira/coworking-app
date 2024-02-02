/*
  Warnings:

  - You are about to drop the column `dataTimeEnd` on the `OrderSala` table. All the data in the column will be lost.
  - You are about to drop the column `dataTimeStart` on the `OrderSala` table. All the data in the column will be lost.
  - You are about to drop the column `opcionalIds` on the `OrderSala` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "OrderSala" DROP COLUMN "dataTimeEnd",
DROP COLUMN "dataTimeStart",
DROP COLUMN "opcionalIds",
ADD COLUMN     "salaHorarioIds" TEXT[];

-- CreateTable
CREATE TABLE "SalaHorario" (
    "id" TEXT NOT NULL,
    "salaId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "orderSalaId" TEXT NOT NULL,

    CONSTRAINT "SalaHorario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reserva" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reserva_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOpcional" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "opcionalId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderOpcional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReservaToSalaHorario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ReservaToSalaHorario_AB_unique" ON "_ReservaToSalaHorario"("A", "B");

-- CreateIndex
CREATE INDEX "_ReservaToSalaHorario_B_index" ON "_ReservaToSalaHorario"("B");

-- AddForeignKey
ALTER TABLE "SalaHorario" ADD CONSTRAINT "SalaHorario_salaId_fkey" FOREIGN KEY ("salaId") REFERENCES "Sala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaHorario" ADD CONSTRAINT "SalaHorario_orderSalaId_fkey" FOREIGN KEY ("orderSalaId") REFERENCES "OrderSala"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reserva" ADD CONSTRAINT "Reserva_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOpcional" ADD CONSTRAINT "OrderOpcional_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOpcional" ADD CONSTRAINT "OrderOpcional_opcionalId_fkey" FOREIGN KEY ("opcionalId") REFERENCES "Opcional"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservaToSalaHorario" ADD CONSTRAINT "_ReservaToSalaHorario_A_fkey" FOREIGN KEY ("A") REFERENCES "Reserva"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReservaToSalaHorario" ADD CONSTRAINT "_ReservaToSalaHorario_B_fkey" FOREIGN KEY ("B") REFERENCES "SalaHorario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
