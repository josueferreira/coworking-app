"use server";
import { prismaClient } from "@/lib/prisma";
import { CartSala } from "@/helpers/sala";

export const createOrder = async (
  cartSalas: CartSala[],
  userId: string,
  dataReserva: Date,
) => {
  const order = await prismaClient.$transaction(async (prisma) => {
    // Crie um novo pedido no banco de dados
    const order = await prisma.order.create({
      data: {
        userId,
        status: "WAITING_FOR_PAYMENT",
        totalPrice: 0,
        orderSalas: {
          create: cartSalas.map((sala) => ({
            salaId: sala.id,
            basePrice: sala.totalPrice,
            discountPercentage: sala.discountPercentage,
          })),
        },
      },
      include: { orderSalas: true },
    });

 // Mapeie e crie os horários para cada sala
await Promise.all(
  cartSalas.map(async (sala) => {
    await Promise.all(
      sala.horarios.map(async (horario) => {
        // Suponha que horario seja uma string no formato 'HH'
        const startHour = parseInt(horario);
        const dataReservaWithTime = new Date(dataReserva);
        console.log("Data REservaaa",dataReservaWithTime);
        dataReservaWithTime.setHours(startHour, 0, 0, 0); // Define hora e minutos na data da reserva

        // Calcule endTime adicionando 1 hora ao startTime
        const endTime = new Date(dataReservaWithTime.getTime());
        endTime.setHours(endTime.getHours() + 1); // Adiciona 1 hora

        // Converta para o horário do Brasil (UTC-3)
        dataReservaWithTime.setUTCHours(dataReservaWithTime.getUTCHours() - 3);
        endTime.setUTCHours(endTime.getUTCHours() - 3);

        await prisma.salaHorario.create({
          data: {
            salaId: sala.id,
            startTime: dataReservaWithTime,
            endTime,
          },
        });
      }),
    );
  }),
);


    return order;
  });

  return order;
};
