import api from './api';

const day = (v) => (v ? String(v).slice(0, 10) : '');

// The API rejects empty text, so send a placeholder when a field is blank
const need = (v, fallback) => {
  const s = (v === null || v === undefined ? '' : String(v)).trim();
  return s || fallback;
};

/* ---------- API -> screens ---------- */
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
  firstName: a.name,
  surname: a.surname,
  name: `${a.name || ''} ${a.surname || ''}`.trim(),
  gender: a.gender,
  specialization: a.specialization,
  email: a.email,
  phone: a.phoneNumber,
});

export const mapCaseType = (t) => ({ id: t.id, name: t.name });

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
});

// Tasks have no task number in the database, so a short code is made from the id.
// A task's attorney is the attorney of its case.
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
  };
};

export async function fetchAllData() {
  const [clients, attorneys, caseTypes, cases, tasks] = await Promise.all([
    api.get('/clients'),
    api.get('/attorneys'),
    api.get('/casetypes'),
    api.get('/cases'),
    api.get('/legaltasks'),
  ]);

  const mappedCases = cases.data.map(mapCase);
  const casesById = Object.fromEntries(mappedCases.map((c) => [c.id, c]));

  return {
    clients: clients.data.map(mapClient),
    attorneys: attorneys.data.map(mapAttorney),
    caseTypes: caseTypes.data.map(mapCaseType),
    cases: mappedCases,
    tasks: tasks.data.map((t) => mapTask(t, casesById)),
  };
}

/* ---------- screens -> API (the body sent on POST and PUT) ---------- */
export const clientPayload = (c) => ({
  clientNumber: c.clientNumber,
  name: c.firstName,
  surname: c.surname,
  gender: c.gender,
  dateOfBirth: c.dateOfBirth,
  homeAddress: c.address,
  email: c.email,
  phoneNumber: c.phone,
  idPassportNumber: c.idNumber,
});

export const attorneyPayload = (a) => {
  let first = a.firstName;
  let last = a.surname;
  if (first === undefined) {
    const parts = String(a.name || '').trim().split(/\s+/);
    first = parts.shift() || '';
    last = parts.join(' ');
  }
  return {
    staffNumber: a.staffNumber,
    name: first,
    surname: need(last, '-'),
    gender: a.gender,
    email: a.email,
    phoneNumber: a.phone,
    specialization: a.specialization,
  };
};

export const casePayload = (c, ctx) => {
  const type = ctx.caseTypes.find((t) => t.name === c.type);
  if (!type) throw new Error(`The case type "${c.type}" is not in the database. Add it first (Step 1c).`);
  const client = ctx.clients.find((x) => x.clientNumber === c.clientNumber);
  if (!client) throw new Error(`Client ${c.clientNumber} was not found in the database.`);
  const attorney = c.attorneyNumber ? ctx.attorneys.find((x) => x.staffNumber === c.attorneyNumber) : null;
  return {
    caseNumber: c.caseNumber,
    caseName: c.title,
    caseDescription: need(c.description, 'No description provided'),
    dateOpened: c.dateOpened,
    caseStatus: c.status,
    caseTypeId: type.id,
    clientId: client.id,
    attorneyId: attorney ? attorney.id : null,
  };
};

export const taskPayload = (t, ctx) => {
  const c = ctx.cases.find((x) => x.caseNumber === t.caseNumber);
  if (!c) throw new Error(`Case ${t.caseNumber} was not found in the database.`);
  return {
    taskName: t.title,
    description: need(t.description, 'No description provided'),
    dueDate: t.dueDate,
    status: t.status,
    caseId: c.id,
  };
};