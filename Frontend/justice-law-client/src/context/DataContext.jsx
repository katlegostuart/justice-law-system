// src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const DataContext = createContext(null);
const MAX_CASELOAD = 8;

export function DataProvider({ children }) {
  const [clients, setClients] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [cases, setCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);

  const fetchData = async () => {
    try {
      const [clientsRes, attorneysRes, casesRes, tasksRes, caseTypesRes] = await Promise.all([
        api.get('/Clients'),
        api.get('/Attorneys'),
        api.get('/Cases'),
        api.get('/LegalTasks'),
        api.get('/CaseTypes') // <-- NEW
      ]);

      // MAP CLIENTS
      setClients(clientsRes.data.map(c => ({
        id: c.id, // GUID
        clientNumber: c.clientNumber,
        firstName: c.name, // API 'name' -> UI 'firstName'
        surname: c.surname,
        gender: c.gender,
        dateOfBirth: c.dateOfBirth.split('T')[0],
        email: c.email,
        phone: c.phoneNumber,
        address: c.homeAddress,
        idNumber: c.idPassportNumber
      })));

      // MAP ATTORNEYS
      setAttorneys(attorneysRes.data.map(a => ({
        id: a.id,
        staffNumber: a.staffNumber,
        name: a.name,
        surname: a.surname,
        gender: a.gender,
        email: a.email,
        phone: a.phoneNumber,
        specialization: a.specialization,
        tier: 'Associate Advocate', // Default since API doesn't have it
        capacity: 8,
        caseload: 0 // Calculate dynamically later
      })));

      // MAP CASES
      setCases(casesRes.data.map(c => ({
        id: c.id,
        caseNumber: c.caseNumber,
        title: c.caseName, // API 'caseName' -> UI 'title'
        type: c.caseType?.name || 'Unknown',
        status: c.caseStatus, // API 'caseStatus' -> UI 'status'
        description: c.caseDescription,
        dateOpened: c.dateOpened.split('T')[0],
        clientId: c.clientId,
        attorneyId: c.attorneyId,
        clientNumber: c.client?.clientNumber,
        attorneyNumber: c.attorney?.staffNumber,
        caseTypeId: c.caseTypeId
      })));

      // MAP TASKS
      setTasks(tasksRes.data.map(t => ({
        id: t.id,
        taskId: `TSK-${t.id.slice(0, 4).toUpperCase()}`, // Generate display ID
        title: t.taskName,
        description: t.description,
        dueDate: t.dueDate.split('T')[0],
        status: t.status,
        caseId: t.caseId
      })));

      // MAP CASE TYPES
      setCaseTypes(caseTypesRes.data);

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // eslint-disable-next-line
  useEffect(() => { fetchData(); }, []);

  const value = {
    clients, setClients,
    attorneys, setAttorneys,
    cases, setCases,
    tasks, setTasks,
    caseTypes, setCaseTypes,
    refreshData: fetchData,
    maxCaseload: MAX_CASELOAD,
    // Helpers
    getClient: (identifier) => clients.find(c => c.clientNumber === identifier || c.id === identifier),
    getAttorney: (identifier) => attorneys.find(a => a.staffNumber === identifier || a.id === identifier),
    clientName: (clientNumber) => {
      const c = clients.find(cl => cl.clientNumber === clientNumber);
      return c ? `${c.firstName} ${c.surname}` : 'Unknown';
    },
    caseload: (staffNumber) => {
      return cases.filter(c => c.attorneyNumber === staffNumber && c.status !== 'Closed').length;
    },
    nextCaseNumber: (dateOpened) => `CAS-${new Date(dateOpened || Date.now()).getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    nextClientNumber: () => `CLI-${Math.floor(1000 + Math.random() * 9000)}`
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);