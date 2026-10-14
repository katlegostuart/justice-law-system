import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [cases, setCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data when the app loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsRes, attorneysRes, casesRes, tasksRes] = await Promise.all([
          api.get('/Clients'),
          api.get('/Attorneys'),
          api.get('/Cases'),
          api.get('/LegalTasks')
        ]);
        setClients(clientsRes.data);
        setAttorneys(attorneysRes.data);
        setCases(casesRes.data);
        setTasks(tasksRes.data);
      } catch (error) {
        console.error("Error fetching data from API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Helper lookups
  const getClient = (clientNumber) => clients.find((c) => c.clientNumber === clientNumber);
  const getAttorney = (staffNumber) => attorneys.find((a) => a.staffNumber === staffNumber);
  const clientName = (clientNumber) => {
    const c = getClient(clientNumber);
    return c ? `${c.name} ${c.surname}` : 'Unknown client';
  };

  const caseload = (staffNumber) =>
    cases.filter((c) => c.attorneyId === staffNumber && c.caseStatus !== 'Closed').length;

  const value = {
    clients, setClients,
    attorneys, setAttorneys,
    cases, setCases,
    tasks, setTasks,
    getClient, getAttorney, clientName, caseload,
    loading
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);