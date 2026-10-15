import api from './api';

const day = (v) => (v ? String(v).slice(0, 10) : '');

// Each mapper turns the API's field names into the names the screens already use.
export const mapClient = (c) => ({
  id: c.id,
  clientNumber: c.clientNumber,
  firstName: c.name,
  surname: c.surname,
  gender: c.gender,
  dateOfBirth: day(c.dateOfBirth),
  idNumber: c.idPassportNumber,
  email: c.email,
  phone: c.phoneNumber,
  address: c.homeAddress,
});

export const mapAttorney = (a) => ({
  id: a.id,
  staffNumber: a.staffNumber,
  name: `${a.name || ''} ${a.surname || ''}`.trim(),
  gender: a.gender,
  specialization: a.specialization,
  email: a.email,
  phone: a.phoneNumber,
});

export const mapCase = (c) => ({
  id: c.id,
  caseNumber: c.caseNumber,
  title: c.caseName,
  type: c.caseType ? c.caseType.name : '',
  status: c.caseStatus,
  clientNumber: c.client ? c.client.clientNumber : null,
  attorneyNumber: c.attorney ? c.attorney.staffNumber : null,
  dateOpened: day(c.dateOpened),
  description: c.caseDescription || '',
  clientId: c.clientId,
  attorneyId: c.attorneyId,
  caseTypeId: c.caseTypeId,
});

// Tasks have no task number in the database, so the screens show a short code from the id.
export const mapTask = (t, casesById) => {
  const c = casesById[t.caseId];
  return {
    id: t.id,
    taskId: 'TSK-' + String(t.id).slice(0, 8).toUpperCase(),
    title: t.taskName,
    description: t.description || '',
    caseNumber: c ? c.caseNumber : '',
    attorneyNumber: c ? c.attorneyNumber : null,
    dueDate: day(t.dueDate),
    status: t.status,
    caseId: t.caseId,
  };
};

export async function fetchAllData() {
  const [clients, attorneys, cases, tasks] = await Promise.all([
    api.get('/clients'),
    api.get('/attorneys'),
    api.get('/cases'),
    api.get('/legaltasks'),
  ]);

  const mappedCases = cases.data.map(mapCase);
  const casesById = Object.fromEntries(mappedCases.map((c) => [c.id, c]));

  return {
    clients: clients.data.map(mapClient),
    attorneys: attorneys.data.map(mapAttorney),
    cases: mappedCases,
    tasks: tasks.data.map((t) => mapTask(t, casesById)),
  };
}