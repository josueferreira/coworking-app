// page.tsx
"use client";
import React, { useEffect, useState } from "react";
import { columns } from "./columns";
import { DataTable } from "./data-table"; // Corrigido o nome do componente
import { getSession, useSession } from "next-auth/react";
import { toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from 'next/navigation';

const Financeiro: React.FC = () => {
  const [financeiro, setFinanceiro] = useState([]);
  const [loading, setLoading] = useState(true);
const [saldo, setSaldo] = useState('');
const router = useRouter();

  // Função para carregar as reservas do usuário
  const carregarFinanceiro = async () => {
    try {
      console.log("Iniciando carregamento de reservas...");
      setLoading(true); // Inicia o carregamento
      const session = await getSession();
      if (!session?.user) {
        throw new Error("Usuário não autenticado");
      }

      const userId = (session.user as any).id;
      const responseSaldo = await fetch(`http://localhost:3000/api/user/${userId}`);
       const  userSaldo = await responseSaldo.json();
       console.log("SALDO CLIENTE SIDE", userSaldo)
      setSaldo(userSaldo.totalCredit);

      // Simule uma chamada à API para buscar as reservas do usuário autenticado
      const response = await fetch("http://localhost:3000/api/reservas/");
      if (!response.ok) {
        throw new Error("Erro ao carregar as reservas - Status: " + response.status);
      }
      const data = await response.json();
      console.log("Reservas carregadas com sucesso:", data);
      setFinanceiro(data.reverse());
      setLoading(false); // Marcar o carregamento como completo
    } catch (error) {
      console.error("Erro ao carregar as reservas:", error);
      setLoading(false); // Marcar o carregamento como completo em caso de erro
    }
  };

  useEffect(() => {
    carregarFinanceiro(); // Carregar as reservas assim que o componente for montado
  }, []); // Passar um array vazio como segundo argumento para garantir que a função seja chamada apenas uma vez

  useEffect(() => {
    console.log("Reservas atualizadas:", financeiro);
  }, [financeiro]); // Log das reservas sempre que o estado de reservas for atualizado

  useEffect(() => {
    console.log("Estado de carregamento atualizado:", loading);
  }, [loading]); // Log do estado de carregamento sempre que ele for atualizado

  const showResponseToast = (message: string, isError: boolean = false) => {
    if (isError) {
      console.log("Erro ao editar reserva!!");
      toast.error("Não é possível cancelar o pedido, faltam menos de 24 horas para o horário reservado.");
    } else {
      console.log("Editado reserva!!");
      toast.success('Pedido cancelado com sucesso!');
      router.refresh();
      carregarFinanceiro(); 
    }
  };

  // Função para lidar com o cancelamento de uma reserva
  const handleCancel = (id: number) => {
    // Adicione aqui a lógica para cancelar a reserva
    // Por enquanto, esta função só exibe um console.log
    console.log("Cancelamento da reserva com ID:", id);
    // Você também pode chamar a função showResponseToast aqui se desejar
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-baseline mb-3">
        <h1 className="text-2xl font-bold mb-4">Financeiro</h1>
        <span className="text-lg font-bold text-white">Saldo: { Number(saldo).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) }</span>
      </div>
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
        <DataTable columns={columns(showResponseToast)} data={financeiro} handleCancel={handleCancel} />
      )}
      </div>
  );
};

export default Financeiro;
