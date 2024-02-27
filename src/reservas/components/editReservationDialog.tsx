"use client";
import React, { useState, useEffect } from "react";
import { SalaHorario } from "../columns";
import { toast } from "react-toastify";

interface EditReservationDialogProps {
  reservationId: string;
  onSave: (newDateTime: Date) => void;
  onClose: () => void;
  salaId: string;
  showResponseToast: (message: string, isError: boolean) => void;
}

const EditReservationDialog: React.FC<EditReservationDialogProps> = ({
  reservationId,
  onSave,
  onClose,
  salaId,
  showResponseToast,
}) => {
  const [newDate, setNewDate] = useState<string>("");
  const [newTime, setNewTime] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [horariosReservados, setHorariosReservados] = useState<SalaHorario[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>("");

  useEffect(() => {
    if (newDate) {
      const fetchData = async () => {
        try {
          const response = await fetch(`/api/salaReservas/${salaId}/${newDate}`);
          if (!response.ok) {
            throw new Error("Erro ao buscar os horários reservados.");
          }
          const data = await response.json();
          setHorariosReservados(data);
        } catch (error) {
          console.error("Erro ao buscar os horários reservados:", error);
          setError("Erro ao buscar os horários reservados. Por favor, tente novamente mais tarde.");
        }
      };

      fetchData();
    }
  }, [newDate, salaId]);

  useEffect(() => {
    if (newDate) {
      const todosHorarios = Array.from({ length: 13 }, (_, index) => index + 8); // Horários de 8am até 8pm (12 horas)
      const horariosFormatados: string[] = [];

      todosHorarios.forEach((hora, index) => {
        if (index < todosHorarios.length - 1) {
          const horaInicio = `${hora}:00`;
          const horaFim = `${hora + 1}:00`;
          const horario = `${horaInicio} - ${horaFim}`;
          horariosFormatados.push(horario);
        }
      });

      setHorariosDisponiveis(horariosFormatados);
    }
  }, [newDate]);

  const handleSave = async () => {
    if (!newDate || !newTime) {
      setError("Por favor, selecione uma data e um horário.");
      return;
    }

    try {
      const [year, month, day] = newDate.split("-");
      const [hour, minute] = newTime.split(":");

      const newDateTime = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour) - 3, parseInt(minute));

      const response = await fetch(`/api/reservas/update/${reservationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newDateTime: newDateTime.toISOString() }),
      });

      if (response.ok) {
        showResponseToast("Reserva atualizada com sucesso!", false);
        onSave(newDateTime);
        onClose();
      } else {
        const data = await response.json();
        setError(data.message || "Erro ao salvar a reserva.");
        showResponseToast("Erro ao salvar a reserva.", true);
      }
    } catch (error) {
      console.error("Erro ao atualizar a reserva:", error);
      setError("Erro ao salvar a reserva. Por favor, tente novamente mais tarde.");
    }
  };

  const handleHorarioSelecionado = (horario: string) => {
    setNewTime(horario.split(" - ")[0]);
    setSelectedTime(horario);
  };

  return (
    <div>
      <div>
        <label>Selecione a Data</label>
        <input
          type="date"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full text-slate-500"
        />
        {horariosDisponiveis.length > 0 && (
          <div className="mt-4">
            <label>Selecione o Horário</label>
            {horariosDisponiveis.map((horario) => {
              const reservado = horariosReservados.some((reserva) => reserva.startTime.includes(horario.split(" - ")[0]));
              const isSelected = selectedTime === horario;
              return (
                <button
                  key={horario}
                  className={`rounded px-4 py-2 ${
                    reservado
                      ? "cursor-not-allowed bg-gray-500"
                      : isSelected
                      ? "bg-blue-700 text-white"
                      : "cursor-pointer bg-blue-500 hover:bg-blue-700"
                  }`}
                  onClick={() => handleHorarioSelecionado(horario)}
                  disabled={reservado}
                >
                  {horario}
                </button>
              );
            })}
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        <button
          className="mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          onClick={handleSave}
        >
          Salvar
        </button>
        <button
          className="ml-2 mt-4 rounded bg-gray-500 px-4 py-2 font-bold text-white hover:bg-gray-700"
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditReservationDialog;
