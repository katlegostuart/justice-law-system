// src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const DataContext = createContext(null);
const MAX_CASELOAD = 8;

// Returns the response data, or null when the call failed (for example a 403 for this role).
const dataOf = (result) => (result.status === 'fulfilled' ? result.value.data : null);

// Day part of a date string, safe if the value is missing.
const day = (value) => (value ? String(value).split('T')[0] : '');

// Remove duplicates by id (used when clients/attorneys are read from the cases).
const uniqueById = (list) => {
  const seen = new Set();
  return list.filter((item) => {
    if (!item || seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
};

export function DataProvider({ children }) {
  const auth = useAuth();
  const userKey = auth?.user?.email;

  const [clients, setClients] = useState([]);
  const [attorneys, setAttorneys] = useState([]);
  const [cases, setCases] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);

  const fetchData = async () => {
    try {
      // allSettled: one failed call (for example a 403) no longer wipes out all the data.
      const [clientsRes, attorneysRes, casesRes, tasksRes, caseTypesRes] = await Promise.allSettled([
        api.get('/Clients'),
        api.get('/Attorneys'),
        api.get('/Cases'),
        api.get('/LegalTasks'),
        api.get('/CaseTypes')
      ]);

      const rawCases = dataOf(casesRes) || [];

      // Admin can read /Clients and /Attorneys. Clients and attorneys cannot,
      // so for them we use the client / attorney that comes inside their own cases.
      const rawClients = dataOf(clientsRes) || uniqueById(rawCases.map((c) => c.client));
      const rawAttorneys = dataOf(attorneysRes) || uniqueById(rawCases.map((c) => c.attorney));
      const rawTasks = dataOf(tasksRes) || [];

      // MAP CLIENTS
      setClients(rawClients.map((c) => ({
        id: c.id,
        clientNumber: c.clientNumber,
        firstName: c.name, // API 'name' -> UI 'firstName'
        surname: c.surname,
        gender: c.gender,
        dateOfBirth: day(c.dateOfBirth),
        email: c.email,
        phone: c.phoneNumber,
        address: c.homeAddress,
        idNumber: c.idPassportNumber
      })));

      // MAP ATTORNEYS
      setAttorneys(rawAttorneys.map((a) => ({
        id: a.id,
        staffNumber: a.staffNumber,
        name: a.name,
        surname: a.surname,
        gender: a.gender,
        email: a.email,
        phone: a.phoneNumber,
        specialization: a.specialization,
        tier: a.tier || 'Associate Advocate',
        capacity: a.capacity || 8,
        caseload: 0
      })));

      // MAP CASES
      const mappedCases = rawCases.map((c) => ({
        id: c.id,
        caseNumber: c.caseNumber,
        title: c.caseName, // API 'caseName' -> UI 'title'
        type: c.caseType?.name || 'Unknown',
        status: c.caseStatus, // API 'caseStatus' -> UI 'status'
        description: c.caseDescription,
        dateOpened: day(c.dateOpened),
        clientId: c.clientId,
        attorneyId: c.attorneyId,
        clientNumber: c.client?.clientNumber,
        attorneyNumber: c.attorney?.staffNumber,
        caseTypeId: c.caseTypeId
      }));
      setCases(mappedCases);

      // MAP TASKS (name and caseNumber are what the dashboards read)
      const caseNumberById = {};
      mappedCases.forEach((c) => { caseNumberById[c.id] = c.caseNumber; });

      setTasks(rawTasks.map((t) => ({
        id: t.id,
        taskId: `TSK-${String(t.id).slice(0, 4).toUpperCase()}`, // Generate display ID
        title: t.taskName,
        name: t.taskName,
        description: t.description,
        dueDate: day(t.dueDate),
        status: t.status,
        caseId: t.caseId,
        caseNumber: caseNumberById[t.caseId]
      })));

      // MAP CASE TYPES
      setCaseTypes(dataOf(caseTypesRes) || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Load the data again whenever a different user logs in or out.
  useEffect(() => {
    if (auth && !auth.user) {
      setClients([]);
      setAttorneys([]);
      setCases([]);
      setTasks([]);
      return;
    }
    fetchData();
    // eslint-disable-next-line
  }, [userKey]);

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
    nextCaseNumber: (dateOpened) => {
      const year = new Date(dateOpened || Date.now()).getFullYear();
      const used = cases
        .map((c) => (c.caseNumber || '').match(new RegExp(`^CAS-${year}-(\\d{1,4})$`)))
        .filter(Boolean).map((m) => Number(m[1]));
      return `CAS-${year}-${String(Math.max(0, ...used) + 1).padStart(3, '0')}`;
    },
    nextClientNumber: () => {
      const used = clients
        .map((c) => (c.clientNumber || '').match(/^CLI-(\d{1,4})$/))
        .filter(Boolean).map((m) => Number(m[1]));
      return `CLI-${String(Math.max(0, ...used) + 1).padStart(3, '0')}`;
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const useData = () => useContext(DataContext);
