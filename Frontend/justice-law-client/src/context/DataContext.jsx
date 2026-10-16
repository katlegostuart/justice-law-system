import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { mockClients, mockAttorneys, mockCases, mockTasks, MAX_CASELOAD } from '../services/mockData';
import api, { USE_API, apiErrorMessage } from '../services/api';
import { fetchAllData, clientPayload, attorneyPayload, casePayload, taskPayload } from '../services/apiData';
  import { useAuth } from './AuthContext';
// One place that holds clients, attorneys, cases and tasks, so every screen shows the same data.
// With USE_API on, the lists come from the database. Pages keep calling setClients, setCases,
// setAttorneys and setTasks: each call is compared with the old list and turned into
// POST (new), PUT (changed) and DELETE (removed) requests, then everything reloads from the API.
const DataContext = createContext(null);

// "key" is the business number that identifies a record on screen
const KINDS = {
  clients: { path: '/clients', key: 'clientNumber', payload: (item) => clientPayload(item) },
  attorneys: { path: '/attorneys', key: 'staffNumber', payload: (item) => attorneyPayload(item) },
  cases: { path: '/cases', key: 'caseNumber', payload: casePayload },
  tasks: { path: '/legaltasks', key: 'taskId', payload: taskPayload },
};

const emptyData = { clients: [], attorneys: [], cases: [], tasks: [], caseTypes: [] };
const sampleData = { clients: mockClients, attorneys: mockAttorneys, cases: mockCases, tasks: mockTasks, caseTypes: [] };

export function DataProvider({ children }) {
  const [data, setData] = useState(USE_API ? emptyData : sampleData);
  const auth = useAuth();
  const token = auth && auth.user ? auth.user.token : null;
  const [apiStatus, setApiStatus] = useState(USE_API ? 'idle' : 'mock');
  const [apiError, setApiError] = useState('');
  const dataRef = useRef(data); // always the newest lists, even inside event handlers
  const queue = useRef(Promise.resolve()); // saves run one after another

  const commit = (next) => {
    dataRef.current = next;
    setData(next);
  };

  const reload = async () => {
    commit(await fetchAllData());
  };

    useEffect(() => {
    if (!USE_API) return;
    if (!token) {
      commit(emptyData);
      setApiStatus('idle');
      setApiError('');
      return;
    }
    setApiStatus('loading');
    reload()
      .then(() => setApiStatus('ok'))
      .catch((err) => {
        setApiStatus('error');
        setApiError(apiErrorMessage(err));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const syncList = (kind, nextInput) => {
    const cfg = KINDS[kind];
    const prev = dataRef.current[kind];
    const next = typeof nextInput === 'function' ? nextInput(prev) : nextInput;

    // 1) show the change on screen straight away
    commit({ ...dataRef.current, [kind]: next });
    if (!USE_API) return;

    // 2) save it to the database
    queue.current = queue.current.then(async () => {
      try {
        const ctx = dataRef.current;
        const prevMap = new Map(prev.map((i) => [i[cfg.key], i]));
        const nextMap = new Map(next.map((i) => [i[cfg.key], i]));
        const json = (item) => {
          try { return JSON.stringify(cfg.payload(item, ctx)); } catch { return 'invalid'; }
        };

        // removed records: DELETE (a 404 means it is already gone, which is fine)
        for (const old of prev) {
          if (!nextMap.has(old[cfg.key]) && old.id) {
            await api.delete(`${cfg.path}/${old.id}`).catch((e) => {
              if (e.response && e.response.status === 404) return;
              throw e;
            });
          }
        }

        // new records: POST, changed records: PUT
        for (const item of next) {
          const old = prevMap.get(item[cfg.key]);
          if (!old) {
            await api.post(cfg.path, cfg.payload(item, ctx));
          } else if (old.id && json(old) !== json(item)) {
            await api.put(`${cfg.path}/${old.id}`, cfg.payload(item, ctx));
          }
        }

        await reload();
        setApiError('');
      } catch (err) {
        setApiError(apiErrorMessage(err));
        try { await reload(); } catch { /* keep the error message above */ }
      }
    });
  };

  const { clients, attorneys, cases, tasks, caseTypes } = data;

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
    const highest = clients.reduce((max, c) => Math.max(max, parseInt(String(c.clientNumber).replace('CLI-', ''), 10) || 0), 0);
    return 'CLI-' + String(highest + 1).padStart(4, '0');
  };

  const nextStaffNumber = () => {
    const highest = attorneys.reduce((max, a) => Math.max(max, parseInt(String(a.staffNumber).replace('STF-', ''), 10) || 0), 99);
    return 'STF-' + String(highest + 1).padStart(3, '0');
  };

  const nextCaseNumber = (dateOpened) => {
    const year = (dateOpened || new Date().toISOString()).slice(0, 4);
    const highest = cases.reduce((max, c) => Math.max(max, parseInt(String(c.caseNumber).split('-')[2], 10) || 0), 0);
    return `CAS-${year}-${String(highest + 1).padStart(4, '0')}`;
  };

  const value = {
    clients, attorneys, cases, tasks, caseTypes,
    setClients: (next) => syncList('clients', next),
    setAttorneys: (next) => syncList('attorneys', next),
    setCases: (next) => syncList('cases', next),
    setTasks: (next) => syncList('tasks', next),
    getClient, getAttorney, clientName, caseload,
    nextClientNumber, nextStaffNumber, nextCaseNumber,
    maxCaseload: MAX_CASELOAD,
    apiStatus, apiError, clearApiError: () => setApiError(''),
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export const useData = () => useContext(DataContext);