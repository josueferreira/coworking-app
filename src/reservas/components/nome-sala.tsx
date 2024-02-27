'use client';
import React, { useState, useEffect } from 'react';

// Componente para buscar e renderizar o nome da sala
const NomeSala: React.FC<{ salaId: string }> = ({ salaId }) => {
    const [nomeSala, setNomeSala] = useState<string>("");
    console.log("id sala", salaId);
  
      const fetchNomeSala = async () => {
        try {
          // Fazer a chamada à API para buscar o nome da sala usando o salaId
          const response = await fetch(`http://localhost:3000/api/sala/horarios/${salaId}`);
          if (!response.ok) {
            throw new Error(`Erro ao buscar nome da sala: ${response.statusText}`);
          }
          const data = await response.json();
          console.log("nome sala", data.name);
          setNomeSala(data.name);
        } catch (error) {
          console.error(error);
          setNomeSala("");
        }
      };
  
      fetchNomeSala();
   
  
    return <>{nomeSala}</>;
  };
  export default NomeSala;