//order.ts
"use server";
import { prismaClient } from "@/lib/prisma";
import { CartSala } from "@/helpers/sala";
import { InterfaceOption } from "@/provider/cart";
import { useRouter } from 'next/navigation';

export const createOrder = async (
  { userId, reservations, totalPrice, ...rest }: { userId: string; reservations: CartSala[]; totalPrice: number; /* additional data */ }
) => {
  // Crie um novo pedido no banco de dados
  const createdOrder = await prismaClient.order.create({
    data: {
      userId,
      status: "WAITING_FOR_PAYMENT",
      totalPrice,
      ...rest, // Inclua propriedades adicionais aqui, se necessário
    },
    include: { orderSalas: true },
  });

  // Mapeie os orderSalas para acessar facilmente o orderSalaId
  const salaIdToOrderSalaId: Record<string, string> = {};

  // Crie as OrderSalas associadas à Order criada
  await Promise.all(reservations.map(async (sala) => {
    const createdOrderSala = await prismaClient.orderSala.create({
      data: {
        salaId: sala.id,
        orderId: createdOrder.id,
        basePrice: sala.basePrice,
        discountPercentage: sala.discountPercentage,
      },
    });

    salaIdToOrderSalaId[sala.id] = createdOrderSala.id;

    // Crie os opcionais para cada sala
    await Promise.all(sala.options.map(async (opcional) => {
      await prismaClient.orderOpcional.create({
        data: {
          orderSalaId: createdOrderSala.id,
          opcionalId: opcional.id,
          quantity: opcional.quantity,
        },
      });
    }));

    // Crie os horários para cada sala
    await Promise.all(sala.horarios.map(async (horario) => {
      // Suponha que horario seja uma string no formato 'HH'
      const startHour = parseInt(horario);

      // Clone a dataReserva para evitar modificá-la
      const reservaDate = new Date(sala.dataReserva);

      // Adicione manualmente as horas ao startTime
      reservaDate.setHours(reservaDate.getHours() + startHour);

      // Calcule endTime adicionando 1 hora ao startTime
      const endTime = new Date(reservaDate.getTime() + 60 * 60 * 1000); // Adicionar 1 hora

      await prismaClient.salaHorario.create({
        data: {
          salaId: sala.id,
          orderSalaId: createdOrderSala.id,
          startTime: reservaDate,
          endTime,
        },
      });
    }));
  }));

  return createdOrder;
};
