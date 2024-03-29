"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SalaList from "./components/listagem";
import { useState, useEffect } from 'react';

const Home = () => {
  const [salas, setSalas] = useState([]);
  const [filteredSalas, setFilteredSalas] = useState([]);
  const [horarioReservado, sethorarioReservado] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [numberOfPeople, setNumberOfPeople] = useState('');
  const [options, setOptions] = useState([]);

  // Função para buscar e definir a lista completa de salas
  const fetchSalas = async () => {
    const response = await fetch('http://localhost:3000/api/sala');
    const data = await response.json();
    setSalas(data.reverse());
  };
  
 useEffect(() => {
  fetchSalas(); // Busca as salas iniciais
  
  const currentDate = new Date().toISOString().slice(0, 10);
  setSelectedDate(currentDate); // Define a data atual
  setNumberOfPeople('1'); // Define o número de pessoas como 1
}, []);

useEffect(() => {
  // Certifique-se de que numberOfPeople esteja definido antes de fazer a busca
  if (numberOfPeople) {
    fetchSearchSalas();
    fetchSalaHorario();
  }
}, [selectedDate, numberOfPeople]);


  const fetchSearchSalas = async () => {

    const response = await fetch(`http://localhost:3000/api/salaSearch/${numberOfPeople}`);
    const data = await response.json();
    
    console.log("numero de pesssoas:", numberOfPeople);
    // Filtrar salas adicionais que são anexáveis
    const filteredSalas = data.filter((sala: any) => sala.numberPeoples >= numberOfPeople || sala.anexavel);

    setFilteredSalas(filteredSalas.reverse());
  };

  const fetchSalaHorario = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/reservaSearch/${selectedDate}`);
      const data = await response.json();
      // Faça o que for necessário com os dados retornados, por exemplo, atualizar o estado
      console.log('Dados da SalaHorario:', data);
      sethorarioReservado(data);

    } catch (error) {
      console.error('Erro ao buscar dados da SalaHorario:', error);
    }
  };

  const fetchOptions = async () => {
    const response = await fetch('http://localhost:3000/api/opcionais');
    const data = await response.json();
    setOptions(data);
  };

  useEffect(() => {
    fetchOptions(); 
  }, []);

  // Função para lidar com a pesquisa
  const handleSearch = async () => {
    // Lógica de pesquisa ou chamada de outras funções relacionadas à pesquisa
    // ...

    // Agora, buscar salas com base nos filtros
    await fetchSearchSalas();
    await fetchSalaHorario();
  };

  return (
    <>
      <div className="bg-banner flex flex-col h-[420px] w-full items-baseline justify-center gap-4 pb-8 ">
        <div className="flex w-full h-full justify-center gap-3">
          <div className="flex  flex-col justify-end  align-baseline">
            <Label className="leading-5" htmlFor="data">Data</Label>
            <Input
              id="data"
              type="date"
              onChange={(e) => setSelectedDate(e.target.value)}
              value={selectedDate} // Definindo o valor do input como a data selecionada
            />
          </div>
          <div className="flex  flex-col justify-end align-baseline">
            <Label className="leading-5" htmlFor="Pessoas">N° de Pessoas</Label>
            <Input
              className="w-24"
              id="pessoas"
              type="number"
              min={1}
              placeholder="1"
              onChange={(e) => setNumberOfPeople(e.target.value)}
              value={numberOfPeople} // Definindo o valor do input como o número de pessoas
            />
          </div>
          <div className="flex  flex-col justify-end align-baseline">
            <Button className="w-32" onClick={handleSearch}>Pesquisar</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-items-center py-14 bg-black">
        <SalaList salas={filteredSalas.length > 0 ? filteredSalas.reverse() : salas} horariosReservados={horarioReservado} selectedDate={selectedDate} options={options}/>
        
      </div>
    </>
  );
};

export default Home;

