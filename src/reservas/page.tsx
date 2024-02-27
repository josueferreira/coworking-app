// page.tsx
"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import { getSession } from "next-auth/react";
import columns, { SalaHorario } from "./columns";
import EditReservationDialog from "./components/editReservationDialog";
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const customStyles = {
  content: {
    background: '#000',
    width:'270px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },

};

const ReservationsPage: React.FC = () => {
  const [reservas, setReservas] = useState<SalaHorario[]>([]);
  const [loading, setLoading] = useState(true);
  const [salaNames, setSalaNames] = useState<Record<string, string>>({});
  const [editingReservationId, setEditingReservationId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCloseEditDialog = () => {
    setEditingReservationId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (reservationId: string) => {
    setEditingReservationId(reservationId);
    setIsModalOpen(true);
  };
  
  const carregarReservas = async () => {
    try {
      console.log("Iniciando carregamento de reservas...");
      setLoading(true); 
      const session = await getSession();
      if (!session?.user) {
        throw new Error("Usuário não autenticado");
      }
  
      const responseReservas = await fetch("http://localhost:3000/api/reservas/horarios/");
      if (!responseReservas.ok) {
        throw new Error(`Erro ao carregar as reservas: ${responseReservas.status}`);
      }
      const dataReservas = await responseReservas.json();
      console.log("Horarios Reservados carregadas com sucesso:", dataReservas);
  
      const uniqueReservas: SalaHorario[] = [];
      const reservaIds = new Set<string>();
      dataReservas.forEach((reserva: SalaHorario) => {
        if (!reservaIds.has(reserva.id)) {
          uniqueReservas.push(reserva);
          reservaIds.add(reserva.id);
        }
      });
  
      const uniqueSalaIds = Array.from(new Set(uniqueReservas.map((reserva: SalaHorario) => reserva.salaId)));
      const salaNames: Record<string, string> = {};
      for (const salaId of uniqueSalaIds) {
        const stringSalaId = String(salaId);
        const responseSala = await fetch(`http://localhost:3000/api/sala/horarios/${salaId}`);
        if (!responseSala.ok) {
          throw new Error(`Erro ao buscar nome da sala ${salaId}: ${responseSala.statusText}`);
        }
        const dataSala = await responseSala.json();
        salaNames[stringSalaId] = dataSala.name;
      }
      setSalaNames(salaNames);
  
      const reservasComNomes = uniqueReservas.map((reserva: SalaHorario) => ({
        ...reserva,
        nomeSala: salaNames[reserva.salaId] || "Nome da Sala Não Encontrado"
      }));
  
      setReservas(reservasComNomes.reverse());
      setLoading(false);
    } catch (error) {
      console.error("Erro ao carregar as reservas:", error);
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    carregarReservas();
  }, []);

const showResponseToast = (message: string, isError: boolean = false) => {
  if (isError) {
    console.log("Erro ao editar reserva!!");
    toast.error("Erro ao editar reserva.");
  } else {
    console.log("Editado reserva!!");
    toast.success('Reserva editada com sucesso!');
  }
};

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Reservas</h1>
      {loading ? (
        <div className="text-center">Carregando...</div>
      ) : (
      <DataTable columns={columns(handleEdit)} data={reservas} />
      )}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={handleCloseEditDialog}
        contentLabel="Editar Reserva"
        style={customStyles}
      >
        <button className="modal-close" onClick={handleCloseEditDialog}>
          <span aria-hidden="true">&times;</span>
        </button>
        {editingReservationId && (
          <EditReservationDialog
            reservationId={editingReservationId}
            onSave={(newDateTime: Date) => {
              const updatedReservas = reservas.map((reserva) => {
                if (reserva.id === editingReservationId) {
                  return { ...reserva, startTime: newDateTime.toISOString() };
                }
                return reserva;
              });
              setReservas(updatedReservas);
              handleCloseEditDialog();
            }}
            onClose={handleCloseEditDialog}

            salaId={reservas.find((reserva) => reserva.id === editingReservationId)?.salaId || ''}
            showResponseToast={showResponseToast} 
          />
        )}
      </Modal>
     
    </div>
  );
};

export default ReservationsPage;
