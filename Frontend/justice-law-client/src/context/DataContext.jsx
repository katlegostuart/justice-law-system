import { createContext, useContext, useState } from 'react';
import { mockClients, mockAttorneys, mockCases, mockTasks, MAX_CASELOAD } from '../services/mockData';

// Holds clients, attorneys, cases and tasks in one place, so every screen
// shows the same data (add a client on one page and it appears everywhere).
// When the real API is ready, these lists will be loaded from it instead.
const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [clients, setClients] = useState(mockClients);
  const [attorneys, setAttorneys] = useState(mockAttorneys);
  const [cases, setCases] = useState(mockCases);
  const [tasks, setTasks] = useState(mockTasks);

  const getClient = (clientNumber) => clients.find((c) => c.clientNumber === clientNumber);
  const getAttorney = (staffNumber) => attorneys.find((a) => a.staffNumber === staffNumber);
  const clientName = (clientNumber) => {
    const c = getClient(clientNumber);
    return c ? `${c.firstName} ${c.surname}` : 'Unknown client';
  };

  // Number of active (not closed) cases an attorney is handling
  const caseload = (staffNumber) =>
    cases.filter((c) => c.attorneyNumber === staffNumber && c.status !== 'Closed').length;

  const nextClientNumber = () => {
    const highest = clients.reduce((max, c) => Math.max(max, parseInt(c.clientNumber.replace('CLI-', ''), 10)), 0);
    return 'CLI-' + String(highest + 1).padStart(4, '0');
  };

  const nextCaseNumber = (dateOpened) => {
    const year = (dateOpened || new Date().toISOString()).slice(0, 4);
    const highest = cases.reduce((max, c) => Math.max(max, parseInt(c.caseNumber.split('-')[2], 10)), 0);
    return `CAS-${year}-${String(highest + 1).padStart(4, '0')}`;
  };

  const value = {
    clients, setClients,
    attorneys, setAttorneys,
    cases, setCases,
    tasks, setTasks,
    getClient, getAttorney, clientName, caseload,
    nextClientNumber, nextCaseNumber,
    maxCaseload: MAX_CASELOAD,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);
