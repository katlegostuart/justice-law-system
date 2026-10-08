// Sample data used until the real API is connected.
// Every screen reads from this one set, so numbers match everywhere.

export const CASE_TYPES = ['Commercial', 'Labour', 'Family', 'Civil', 'Property', 'Criminal'];
export const CASE_STATUSES = ['Open', 'In Progress', 'Pending Hearing', 'Closed'];
export const TASK_STATUSES = ['Not Started', 'In Progress', 'Complete'];

// An attorney cannot be given more active (not closed) cases than this.
export const MAX_CASELOAD = 8;

export const mockClients = [
  { clientNumber: 'CLI-4029', firstName: 'Eleanor', surname: 'Vance', gender: 'Female', dateOfBirth: '1984-06-12', idNumber: '8406125089083', email: 'e.vance@vanceholdings.co.za', phone: '+27 82 455 1920', address: '44 Rosebank Blvd, Johannesburg, 2196' },
  { clientNumber: 'CLI-3108', firstName: 'Bongani', surname: 'Mkhize', gender: 'Male', dateOfBirth: '1976-10-02', idNumber: '7610025291084', email: 'b.mkhize@mkhizeholdings.com', phone: '+27 71 902 4410', address: '12 Umhlanga Ridge, Durban, 4319' },
  { clientNumber: 'CLI-2094', firstName: 'Claire', surname: 'Archer-Smit', gender: 'Female', dateOfBirth: '1982-03-14', idNumber: '8203140041089', email: 'claire.archer@capewineries.com', phone: '+27 83 552 1198', address: '8 Vineyard Road, Stellenbosch, 7600' },
  { clientNumber: 'CLI-6712', firstName: 'Tariq', surname: 'Kruger', gender: 'Male', dateOfBirth: '1991-12-05', idNumber: '9112055082080', email: 'tariq.k@krugerconsult.org', phone: '+27 79 311 0022', address: '5 Church Street, Pretoria, 0002' },
  { clientNumber: 'CLI-5110', firstName: 'Lerato', surname: 'Dlamini', gender: 'Female', dateOfBirth: '1988-07-21', idNumber: '8807210123085', email: 'lerato.d@sterlinglogistics.co.za', phone: '+27 11 880 2900', address: '21 Main Road, Sandton, 2196' },
  { clientNumber: 'CLI-1190', firstName: 'Sipho', surname: 'Nkosi', gender: 'Male', dateOfBirth: '1979-01-30', idNumber: '7901305455087', email: 'sipho.nkosi@khumalocpa.co.za', phone: '+27 12 446 7712', address: '33 Park Lane, Centurion, 0157' },
];

// Molefi owns the Attorney screens and can extend these.
export const mockAttorneys = [
  { staffNumber: 'STF-102', name: 'Thabo Sithole', gender: 'Male', specialization: 'Commercial Law', email: 't.sithole@justicelaw.co.za', phone: '+27 11 555 0192' },
  { staffNumber: 'STF-104', name: 'Katlego Mokgohlwa', gender: 'Male', specialization: 'Criminal Law', email: 'k.mokgohlwa@justicelaw.co.za', phone: '+27 11 555 0831' },
  { staffNumber: 'STF-108', name: 'Sipho Ndlovu', gender: 'Male', specialization: 'Labour Law', email: 's.ndlovu@justicelaw.co.za', phone: '+27 31 440 2110' },
  { staffNumber: 'STF-111', name: 'Nomsa Van Der Merwe', gender: 'Female', specialization: 'Property Law', email: 'n.vandermerwe@justicelaw.co.za', phone: '+27 21 401 9904' },
  { staffNumber: 'STF-115', name: 'Lindiwe Khumalo', gender: 'Female', specialization: 'Family Law', email: 'l.khumalo@justicelaw.co.za', phone: '+27 11 555 7712' },
  { staffNumber: 'STF-118', name: 'Zanele Mokoena', gender: 'Female', specialization: 'Civil Law', email: 'z.mokoena@justicelaw.co.za', phone: '+27 11 555 3340' },
];

export const mockCases = [
  { caseNumber: 'CAS-2024-0891', title: 'Vanderbilt Asset Restructuring', type: 'Commercial', status: 'In Progress', clientNumber: 'CLI-4029', attorneyNumber: 'STF-102', dateOpened: '2024-01-12', description: 'Corporate restructuring and share purchase agreement for the Vance holdings.' },
  { caseNumber: 'CAS-2024-0944', title: 'Apex Logistics vs TransRail Arbitration', type: 'Labour', status: 'In Progress', clientNumber: 'CLI-5110', attorneyNumber: 'STF-108', dateOpened: '2024-02-28', description: 'Arbitration over a collective bargaining dispute.' },
  { caseNumber: 'CAS-2024-1002', title: 'Mthembu Estate Execution', type: 'Family', status: 'Open', clientNumber: 'CLI-3108', attorneyNumber: null, dateOpened: '2024-03-14', description: 'Execution of a testamentary estate.' },
  { caseNumber: 'CAS-2024-1055', title: 'Helios Solar Infrastructure Breach', type: 'Civil', status: 'Pending Hearing', clientNumber: 'CLI-2094', attorneyNumber: 'STF-118', dateOpened: '2024-04-02', description: 'Breach of contract claim over solar infrastructure.' },
  { caseNumber: 'CAS-2023-0419', title: 'Khumalo Mineral Concession Deeds', type: 'Property', status: 'Closed', clientNumber: 'CLI-1190', attorneyNumber: 'STF-111', dateOpened: '2023-11-19', description: 'Registration of mineral concession deeds.' },
  { caseNumber: 'CAS-2024-1108', title: 'State vs De Kock Securities Fraud', type: 'Criminal', status: 'Open', clientNumber: 'CLI-6712', attorneyNumber: null, dateOpened: '2024-04-18', description: 'Defence in a securities fraud matter.' },
  { caseNumber: 'CAS-2023-0412', title: 'Vance Family Trust Property Transfer', type: 'Property', status: 'Closed', clientNumber: 'CLI-4029', attorneyNumber: 'STF-111', dateOpened: '2023-06-05', description: 'Transfer of trust property and registration at the Deeds Office.' },
  { caseNumber: 'CAS-2024-1120', title: 'Metropolitan Fleet Supply Dispute', type: 'Commercial', status: 'Open', clientNumber: 'CLI-5110', attorneyNumber: 'STF-102', dateOpened: '2024-04-20', description: 'Commercial contract dispute over delayed fleet supply.' },
];

// Molefi owns the Legal Tasks screens and can extend these.
export const mockTasks = [
  { taskId: 'TSK-8820', caseNumber: 'CAS-2024-0891', name: 'Draft Share Purchase Agreement', description: 'Includes indemnity clauses and shareholder restructuring annexures.', dueDate: '2024-10-24', status: 'Complete' },
  { taskId: 'TSK-8835', caseNumber: 'CAS-2024-0891', name: 'Prepare Affidavit for High Court Discovery', description: 'Financial declaration documentation and balance audit filing.', dueDate: '2024-11-04', status: 'In Progress' },
  { taskId: 'TSK-8840', caseNumber: 'CAS-2024-0891', name: 'Schedule Client Pre-Trial Consultation', description: 'Strategy review with lead counsel ahead of the formal motion.', dueDate: '2024-11-08', status: 'In Progress' },
  { taskId: 'TSK-8841', caseNumber: 'CAS-2024-0891', name: 'File Master Court Documentation', description: 'Registrar endorsement and official service to the counterpart attorneys.', dueDate: '2024-11-15', status: 'Not Started' },
  { taskId: 'TSK-8850', caseNumber: 'CAS-2024-0944', name: 'Lodge Statement of Claim', description: 'Prepare and lodge the arbitration statement of claim.', dueDate: '2024-05-10', status: 'In Progress' },
];
