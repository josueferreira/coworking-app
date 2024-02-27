import { ColumnDef, AccessorFn, Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

// Definição do tipo de dados para uma reserva
export type Financeiro = {
  id: number;
  status: string;
  totalPrice: number;
  createdAt: string;
};

// Interface para as propriedades das colunas do componente FinanceiroColumns
interface FinanceiroColumnsProps {
  showResponseToast: (message: string, isError: boolean) => void;
}

// Função para formatar o status da reserva
const formatStatus: AccessorFn<Financeiro, string | JSX.Element> = (financeiro) => {
  const { status } = financeiro;
  if (status === "WAITING_FOR_PAYMENT") {
    return "Aguardando Pagamento";
  } else if (status === "PAYMENT_CONFIRMED") {
    return "Pagamento Confirmado";
  } else {
    return status;
  }
};

// Função para formatar o preço total da reserva para o formato de moeda brasileira
const formatPrice: AccessorFn<Financeiro, string> = (financeiro) => {
  const { totalPrice } = financeiro;
  return totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
};

// Função para formatar a data para mostrar apenas a data sem a hora
const formatDate: AccessorFn<Financeiro, string> = (financeiro) => {
  const { createdAt } = financeiro;
  return new Date(createdAt).toLocaleDateString("pt-BR");
};

// Função para renderizar a célula da coluna de ações
const renderActionsCell = (showResponseToast: (message: string, isError: boolean) => void) => ({ row }: { row: Row<Financeiro> }) => {
  const financeiro: Financeiro = row.original; // Definindo explicitamente o tipo de financeiro
  const router = useRouter();

  // Função para excluir a reserva
  const handleCancelClick = async () => {
    try {
      // Chamada à API para excluir a reserva
      const response = await fetch(`http://localhost:3000/api/reservas/delete/${financeiro.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        console.log('Reserva cancelada com sucesso.');
        // Atualizar a tabela
        showResponseToast('Reservas canceladas com sucesso!', false);
      } else {
        // Exibir mensagem de erro
        showResponseToast('Não é possível cancelar uma reserva que iniciará em menos de 24 horas.', true);
        console.error('Erro ao cancelar a reserva:', response.statusText);
      }
    } catch (error) {
      console.error('Erro ao cancelar a reserva:', error);
      // Exibir mensagem de erro
      showResponseToast('Erro ao cancelar a reserva.', true);
    }
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
        <DropdownMenuItem className="cursor-pointer" onClick={handleCancelClick}>CANCELAR</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Definição das colunas da tabela de reservas
export const columns = (showResponseToast: (message: string, isError: boolean) => void): ColumnDef<Financeiro>[] => [
  { accessorKey: "id", header: "ID" },
  { accessorKey: "status", header: "Pagamento", accessorFn: formatStatus },
  { accessorKey: "totalPrice", header: "Total", accessorFn: formatPrice },
  { accessorKey: "createdAt", header: "Data", accessorFn: formatDate },
  {
    id: "actions",
    cell: renderActionsCell(showResponseToast),
  },
];

