export const mockClients = [
  { clientNumber: 'CLI-4029', firstName: 'Eleanor', surname: 'Vance', gender: 'Female', dateOfBirth: '1984-06-12', idNumber: '8406125089083', email: 'e.vance@vanceholdings.co.za', phone: '+27 82 455 1920', address: '44 Rosebank Blvd, Johannesburg, 2196' },
  { clientNumber: 'CLI-3108', firstName: 'Bongani', surname: 'Mkhize', gender: 'Male', dateOfBirth: '1976-10-02', idNumber: '7610025291084', email: 'b.mkhize@mkhizeholdings.com', phone: '+27 71 902 4410', address: '12 Umhlanga Ridge, Durban, 4319' },
  { clientNumber: 'CLI-2094', firstName: 'Claire', surname: 'Archer-Smit', gender: 'Female', dateOfBirth: '1982-03-14', idNumber: '8203140041089', email: 'claire.archer@capewineries.com', phone: '+27 83 552 1198', address: '8 Vineyard Road, Stellenbosch, 7600' },
  { clientNumber: 'CLI-6712', firstName: 'Tariq', surname: 'Kruger', gender: 'Male', dateOfBirth: '1991-12-05', idNumber: '9112055082080', email: 'tariq.k@krugerconsult.org', phone: '+27 79 311 0022', address: '5 Church Street, Pretoria, 0002' },
  { clientNumber: 'CLI-5110', firstName: 'Lerato', surname: 'Dlamini', gender: 'Female', dateOfBirth: '1988-07-21', idNumber: '8807210123085', email: 'lerato.d@sterlinglogistics.co.za', phone: '+27 11 880 2900', address: '21 Main Road, Sandton, 2196' },
  { clientNumber: 'CLI-1190', firstName: 'Sipho', surname: 'Nkosi', gender: 'Male', dateOfBirth: '1979-01-30', idNumber: '7901305455087', email: 'sipho.nkosi@khumalocpa.co.za', phone: '+27 12 446 7712', address: '33 Park Lane, Centurion, 0157' },
];

export const mockAttorneys = [
  { staffNumber: 'STF-102', name: 'Thabo Sithole', gender: 'Male', specialization: 'Commercial Law' },
  { staffNumber: 'STF-104', name: 'Katlego Mokgohlwa', gender: 'Male', specialization: 'Criminal Law' },
  { staffNumber: 'STF-108', name: 'Sipho Ndlovu', gender: 'Male', specialization: 'Labour Law' },
  { staffNumber: 'STF-111', name: 'Nomsa Van Der Merwe', gender: 'Female', specialization: 'Property Law' },
  { staffNumber: 'STF-115', name: 'Lindiwe Khumalo', gender: 'Female', specialization: 'Family Law' },
];

export const mockCases = [
  { caseNumber: 'CAS-2024-0891', title: 'Vanderbilt Asset Restructuring', type: 'Commercial', status: 'In Progress', clientNumber: 'CLI-4029', attorneyNumber: 'STF-102', dateOpened: '2024-01-12' },
  { caseNumber: 'CAS-2024-0944', title: 'Apex Logistics vs TransRail Arbitration', type: 'Labour', status: 'In Progress', clientNumber: 'CLI-5110', attorneyNumber: 'STF-104', dateOpened: '2024-02-28' },
  { caseNumber: 'CAS-2024-1002', title: 'Mthembu Estate Execution', type: 'Family', status: 'Open', clientNumber: 'CLI-3108', attorneyNumber: null, dateOpened: '2024-03-14' },
  { caseNumber: 'CAS-2024-1055', title: 'Helios Solar Infrastructure Breach', type: 'Civil', status: 'Pending Hearing', clientNumber: 'CLI-2094', attorneyNumber: 'STF-108', dateOpened: '2024-04-02' },
  { caseNumber: 'CAS-2023-0419', title: 'Khumalo Mineral Concession Deeds', type: 'Property', status: 'Closed', clientNumber: 'CLI-1190', attorneyNumber: 'STF-111', dateOpened: '2023-11-19' },
  { caseNumber: 'CAS-2024-1108', title: 'State vs De Kock Securities Fraud', type: 'Criminal', status: 'Open', clientNumber: 'CLI-6712', attorneyNumber: null, dateOpened: '2024-04-18' },
];
