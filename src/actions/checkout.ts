//checkout.ts
"use server";
import { prismaClient } from "@/lib/prisma";
import { Decimal } from '@prisma/client/runtime/library';
import { createOrder } from "./order";
import { CartSala } from "@/helpers/sala";

export const checkout = async (
    { userId, reservations, totalPrice, ...rest }: { userId: string; reservations: CartSala[]; totalPrice: number; /* additional data */ }
  ) => {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
    });
  
    if (!user) {
      throw new Error('Usuário não encontrado');
    }
  
    const currentTotalCredit = user.totalCredit;
  
    if (currentTotalCredit.lessThanOrEqualTo(new Decimal(totalPrice))) {
      throw new Error('Saldo insuficiente');
    }
  
    await prismaClient.user.update({
      where: { id: userId },
      data: { totalCredit: currentTotalCredit.sub(new Decimal(totalPrice)) },
    });
  
    await createOrder({
      userId,
      reservations,
      totalPrice,
    });
  
    // ... outras ações após a compra ...
  };