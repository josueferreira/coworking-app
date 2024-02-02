"use client";
import { useContext, useState, useEffect } from "react";
import { Sala } from "@prisma/client";
import { Opcional } from "@prisma/client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CartContext, InterfaceOption } from "@/provider/cart";
import {
  CarTaxiFront,
  CircleDollarSign,
  Clock,
  Coffee,
  ShoppingCart,
  User,
  Users,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface SalaListProps {
  salas: Sala[];
  horariosReservados: any[];
  selectedDate: string;
  options: Opcional[];
}

const SalaList = ({
  salas,
  horariosReservados,
  selectedDate,
  options,
}: SalaListProps) => {
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedHorarios, setSelectedHorarios] = useState<{
    [key: string]: string[];
  }>({});
  const [selectedOptions, setSelectedOptions] = useState<{
    [key: string]: InterfaceOption[];
  }>({});
  const [selectedOptionsQuantity, setSelectedOptionsQuantity] = useState<{
    [key: string]: number;
  }>({});

  const { addSalaToCart } = useContext(CartContext);

  useEffect(() => {
    const horariosDisponiveisAtualizados: { [key: string]: string[] } = {};

    // Mapear horários disponíveis por sala
    salas.forEach((sala) => {
      const todosHorarios = Array.from({ length: 12 }, (_, index) => index + 8);
      const horariosReservadosDaSala = horariosReservados
        .filter((h) => h.salaId === sala.id)
        .map((h) => h.startTime.split("T")[1].substring(0, 5));

      const horariosDisponiveis = todosHorarios.filter(
        (horario) => !horariosReservadosDaSala.includes(`${horario}:00`),
      );

      horariosDisponiveisAtualizados[sala.id] = horariosDisponiveis.map(String);
    });

    setHorariosDisponiveis(horariosDisponiveisAtualizados);
  }, [salas, horariosReservados]);

  const isHorarioReservado = (salaId: string, horario: string) => {
    return horariosDisponiveis[salaId]?.includes(horario);
  };
  const handleReserva = (sala: any) => {
    const { id, name, basePrice, discountPercentage, opcionais } = sala;
    const salaHorarios = selectedHorarios[id] || [];
    const salaOptions = selectedOptions[id] || [];

    console.log("Selected Options:", salaOptions);

    salaHorarios.forEach((horario) => {
      const selectedOpcionais = (salaOptions || [])
        .map((selectedOption: InterfaceOption) => {
          const { index, quantity } = selectedOption;
          const option = opcionais && opcionais[index];

          if (option) {
            return {
              name: option.name,
              quantity: quantity,
            };
          }

          return null;
        })
        .filter(Boolean) as InterfaceOption[];

      console.log("Updated selectedOptions state 1:", selectedOptions);
      console.log(`Reservar sala ${id} para o horário ${horario}:00`);

      addSalaToCart(
        {
          id,
          horarios: [horario],
          name,
          basePrice,
          discountPercentage,
          totalPrice: basePrice,
          imageUrls: sala.imageUrls,
          priceWithoutDiscount: basePrice,
          dataReserva: selectedDate,
          options: salaOptions,
          optionsTotalPrice: basePrice,
        },
        selectedDate,
        salaOptions,
      );
    });

    setSelectedOptions((prev) => ({
      ...prev,
      [id]: [], // Isso sempre redefine para um array vazio
    }));

    setSelectedHorarios((prev) => ({
      ...prev,
      [id]: [],
    }));
  };

  useEffect(() => {
    console.log("Updated selectedOptions state:", selectedOptions);
  }, [selectedOptions]);

  return (
    <div className="grid w-4/5 grid-cols-1 items-center justify-center gap-4 md:w-[85vw] lg:grid-cols-2">
      {salas.map((sala) => (
        <Card
          key={sala.id}
          className="flex justify-start border-gray-500 bg-gray-100 p-7 lg:w-full lg:max-w-[80vw]"
        >
          <CardContent className="p-0">
            <div key={sala.id} className="relative flex flex-col gap-4">
              <div className="absolute -top-3 right-0 z-20">
                {sala.anexavel === true ? (
                  <Badge className="bg-red-700 px-5 py-2 hover:bg-red-700">
                    Sala Anexável
                  </Badge>
                ) : null}
              </div>
              <div className="flex flex-col">
                {sala.imageUrls.length > 0 && (
                  <Carousel className="h-full w-full">
                    <CarouselContent>
                      {sala.imageUrls.map((imagem, index) => (
                        <CarouselItem key={index}>
                          <Image
                            src={imagem}
                            height={0}
                            width={0}
                            sizes="100vw"
                            className="h-[300px] w-full object-cover md:h-80"
                            alt={`Sala ${sala.id} - Imagem ${index + 1}`}
                          />
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}
              </div>
              <div className="flex flex-col text-gray-800">
                <div className="flex flex-row items-center  justify-between border-b-2 pb-2">
                  <h2 className="text-lg font-bold lg:col-span-2">
                    {sala.name}
                  </h2>
                  <div>
                    <Badge className="md:w-content mr-4 w-fit items-center justify-center whitespace-pre px-2 py-2 text-center md:mr-1">
                      <Users size={16} className="mr-1" /> {sala.numberPeoples}{" "}
                      Pessoas
                    </Badge>
                    <Badge className="md:w-content  ml-3  w-fit items-center justify-center whitespace-pre px-2 py-2 text-center md:ml-0">
                      <CircleDollarSign size={16} className="mr-1" />
                      {sala.basePrice
                        ? Number(sala.basePrice).toFixed(2)
                        : "Preço não disponível"}
                      /hora
                    </Badge>
                  </div>
                </div>
                <p className="border-b-2">{sala.description}</p>
              </div>
              {horariosDisponiveis[sala.id]?.length > 0 && (
                <div className="flex flex-col text-black">
                  <div>
                    <div className="flex flex-row items-center gap-2">
                      {" "}
                      <Clock size={20} /> Horários Disponíveis
                    </div>
                    <Separator className=" my-3" />
                    <div className="mb-2">
                      {Array.from({ length: 12 }, (_, index) => index + 8).map(
                        (horario) => (
                          <Button
                            key={horario}
                            onClick={() => {
                              const horarioStr = String(horario);
                              setSelectedHorarios((prev) => {
                                const isSelected = (prev[sala.id] || []).includes(horarioStr);
                        
                                if (isSelected) {
                                  // If already selected, remove it
                                  return {
                                    ...prev,
                                    [sala.id]: (prev[sala.id] || []).filter(
                                      (selected) => selected !== horarioStr
                                    ),
                                  };
                                } else {
                                  // If not selected, add it
                                  return {
                                    ...prev,
                                    [sala.id]: [...(prev[sala.id] || []), horarioStr],
                                  };
                                }
                              });
                            }}
                            disabled={
                              !isHorarioReservado(sala.id, String(horario))
                            }
                            variant={"outline"}
                            className={`bg-${
                              isHorarioReservado(sala.id, String(horario))
                                ? "white"
                                : "black"
                            } bg-${selectedHorarios[sala.id]?.includes(String(horario)) ? "black" : "white"} text-${selectedHorarios[sala.id]?.includes(String(horario)) ? "white" : "black"}`}
                          >
                            {`${horario}:00 - ${horario + 1}:00`}
                          </Button>
                        ),
                      )}
                    </div>
                  </div>
                  {options && options.length > 0 && (
                    <div className="mx-0 my-4 p-0">
                      <div className="flex flex-row items-center gap-2">
                        <Coffee size={20} /> Coffee Break
                      </div>
                      <Separator className=" my-3" />
                      <div className="list-price flex flex-wrap gap-2">
                        {options && options.length > 0 && (
                          <div className="list-price flex flex-row gap-2">
                           <ul className="flex flex-wrap gap-2">
                           {options.map((opcao, index) => (
                              
                              <li key={index}>
                                {opcao.name} - R${" "}
                                {opcao.price
                                  ? Number(opcao.price).toFixed(2)
                                  : "Preço não disponível"}
                              </li>
                             
                              
                            ))}
                            </ul>
                          </div>
                        )}
                        {options.map((opcao, index) => (
                          <div className="flex gap-1" key={index}>
                            <Button
                              onClick={() => {
                                console.log("Clicked on option:", opcao.name);
                                console.log(
                                  "Previous selectedOptions state:",
                                  selectedOptions,
                                );

                                setSelectedOptions((prev: any) => {
                                  const existingOptions = prev[sala.id] || [];
                                  const existingOptionIndex =
                                    existingOptions.findIndex(
                                      (selectedOption: any) =>
                                        selectedOption.index === index,
                                    );

                                  if (existingOptionIndex !== -1) {
                                    // Se o opcional já estiver na lista, atualize a quantidade
                                    const updatedOptions = [...existingOptions];
                                    updatedOptions[existingOptionIndex] = {
                                      index,
                                      name: opcao.name,
                                      quantity:
                                        (updatedOptions[existingOptionIndex]
                                          ?.quantity || 0) + 1,
                                      price: Number(opcao.price)
                                    };

                                    console.log(
                                      "Updated selectedOptions state 1:",
                                      updatedOptions,
                                    );

                                    return {
                                      ...prev,
                                      [sala.id]: updatedOptions,
                                    };
                                  } else {
                                    // Se o opcional não estiver na lista, adicione-o com a quantidade 1
                                    console.log("New selectedOptions state:", [
                                      ...existingOptions,
                                      { index, name: opcao.name, quantity: 1, price: opcao.price },
                                    ]);

                                    return {
                                      ...prev,
                                      [sala.id]: [
                                        ...existingOptions,
                                        {
                                          index,
                                          name: opcao.name,
                                          quantity: 1,
                                          price: opcao.price,
                                        },
                                      ],
                                    };
                                  }
                                });

                                setSelectedOptionsQuantity((prev) => ({
                                  ...prev,
                                  [`${sala.id}-${index}`]:
                                    (prev[`${sala.id}-${index}`] || 0) + 1,
                                }));
                              }}
                              className={`w-content active:bg-${
                                selectedOptions[sala.id]?.find(
                                  (selectedOption) =>
                                    selectedOption.index === index,
                                )
                                  ? "black"
                                  : "black"
                              }`}
                            >
                              + {opcao.name} (
                              {selectedOptionsQuantity[`${sala.id}-${index}`] ||
                                0}
                              )
                            </Button>

                            <Button
                              onClick={() => {
                                console.log("Clicked on option:", opcao.name);
                                console.log(
                                  "Previous selectedOptions state:",
                                  selectedOptions,
                                );

                                setSelectedOptions((prev) => {
                                  const newState = {
                                    ...prev,
                                    [sala.id]: (prev[sala.id] || []).filter(
                                      (selected) => selected.index !== index,
                                    ),
                                  };

                                  console.log(
                                    "New selectedOptions state:",
                                    newState,
                                  );

                                  return newState;
                                });

                                setSelectedOptionsQuantity((prev) => ({
                                  ...prev,
                                  [`${sala.id}-${index}`]: Math.max(
                                    (prev[`${sala.id}-${index}`] || 0) - 1,
                                    0,
                                  ),
                                }));
                              }}
                              className={`bg-${
                                selectedOptions[sala.id]?.find(
                                  (selectedOption) =>
                                    selectedOption.index === index,
                                )
                                  ? "black"
                                  : "black"
                              }`}
                            >
                              -
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Button onClick={() => handleReserva(sala)}>
                    <ShoppingCart size={16} className="mr-3" /> Adicionar ao
                    Carrinho
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SalaList;
