import React, { useState } from 'react';

interface EditReservationFormProps {
  onSave: () => void;
}

const EditReservationForm: React.FC<EditReservationFormProps> = ({ onSave }) => {
  const [newDateTime, setNewDateTime] = useState<Date>(new Date());

  const handleSave = () => {
    // Lógica para salvar a reserva com a nova data e hora
    onSave();
  };

  return (
    <div>
      <label>Nova Data e Hora:</label>
      <input
        type="datetime-local"
        value={newDateTime.toISOString().slice(0, 16)}
        onChange={(e) => setNewDateTime(new Date(e.target.value))}
      />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};

export default EditReservationForm;
