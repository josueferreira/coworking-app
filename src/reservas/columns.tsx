// columns.tsx
import React from "react";
import { ColumnDef, AccessorFn } from "@tanstack/react-table";
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export type SalaHorario = {
  id: string;
  salaId: string;
  orderSalaId: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  nomeSala: string;
};

// Função para formatar a data de criação para mostrar apenas a data sem a hora
const formatDate: AccessorFn<SalaHorario, string> = (salaHorario) => {
  const { createdAt } = salaHorario;
  return new Date(createdAt).toLocaleDateString("pt-BR");
};

// Função para formatar a data e hora de início com +1 hora
const formatDateTime: AccessorFn<SalaHorario, string> = (salaHorario) => {
  const { startTime } = salaHorario;
  const startDateTime = new Date(startTime);
  const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // Adiciona 1 hora ao horário inicial
  const startDate = startDateTime.toLocaleDateString("pt-BR").split('T')[0];
  const startHour = startDateTime.toISOString().split('T')[1].substring(0, 5);
  const endHour = endDateTime.toISOString().split('T')[1].substring(0, 5);
  return `${startDate} | ${startHour} - ${endHour}`;
};

// Função para verificar se a reserva pode ser editada (mais de 24 horas antes do horário)
const isEditable = (reservationDateTime: Date) => {
  const currentDate = new Date();
  const diffInMs = reservationDateTime.getTime() - currentDate.getTime();
  const diffInHours = diffInMs / (1000 * 60 * 60);
  return diffInHours > 24;
};

const columns = (handleEdit: (reservationId: string) => void): ColumnDef<SalaHorario>[] => [
  { accessorKey: 'nomeSala', header: 'Sala' },
  { accessorKey: 'startTime', header: 'Data Reserva | Horário', accessorFn: formatDateTime },
  { accessorKey: 'orderSalaId', header: 'Nº do Pedido' },
  { accessorKey: "createdAt", header: "Data Pedido", accessorFn: formatDate },
  {
    id: 'actions',
    cell: ({ row }) => {
      const { startTime } = row.original;
      const reservationDateTime = new Date(startTime);
      const editable = isEditable(reservationDateTime);
      const handleClick = () => {
        if (!editable) {
          toast.error('Não é possível editar. Faltam menos de 24 horas para o horário reservado.');
         console.log("menos de 24 horas")
          return;
        }
        handleEdit(row.original.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>AÇÕES</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer" onClick={handleClick}>
              EDITAR
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default columns;
