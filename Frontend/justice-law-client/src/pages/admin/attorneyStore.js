import { useSyncExternalStore } from 'react';

export const SPECIALIZATIONS = ['Commercial Law', 'Criminal Law', 'Family Law', 'Labor Law', 'Property Law', 'Civil Law'];
export const TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel', 'Associate Advocate', 'Junior Advocate'];
export const SENIOR_TIERS = ['Senior Partner', 'Junior Partner', 'Senior Counsel'];

/* Mock data (replace with API calls later) */
const SEED = [
  { id: 1, staffNo: 'STF-102', name: 'Thabo', surname: 'Sithole', gender: 'Male', tier: 'Senior Counsel', specialization: 'Commercial Law', email: 't.sithole@justicelaw.co.za', phone: '+27 11 555 0192', capacity: 8, caseload: 6 },
  { id: 2, staffNo: 'STF-104', name: 'Katlego', surname: 'Mokgohlwa', gender: 'Female', tier: 'Junior Partner', specialization: 'Criminal Law', email: 'k.mokgohlwa@justicelaw.co.za', phone: '+27 11 555 0831', capacity: 8, caseload: 4 },
  { id: 3, staffNo: 'STF-108', name: 'Sipho', surname: 'Ndlovu', gender: 'Male', tier: 'Associate Advocate', specialization: 'Labor Law', email: 's.ndlovu@justicelaw.co.za', phone: '+27 31 440 2110', capacity: 8, caseload: 3 },
  { id: 4, staffNo: 'STF-111', name: 'Nandi', surname: 'Van Der Merwe', gender: 'Female', tier: 'Senior Counsel', specialization: 'Property Law', email: 'n.vandermerwe@justicelaw.co.za', phone: '+27 21 401 9904', capacity: 8, caseload: 5 },
  { id: 5, staffNo: 'STF-115', name: 'Lerato', surname: 'Khumalo', gender: 'Female', tier: 'Junior Advocate', specialization: 'Family Law', email: 'l.khumalo@justicelaw.co.za', phone: '+27 11 555 7712', capacity: 8, caseload: 2 },
];

export const staffLabel = (n) => `STF-${String(n).padStart(3, '0')}`;

let state = { rows: SEED, nextNo: 116 };
const listeners = new Set();
const emit = () => listeners.forEach((l) => l());

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};
const getSnapshot = () => state;

export const useAttorneys = () => useSyncExternalStore(subscribe, getSnapshot);

export function addAttorney(a) {
  state = {
    rows: [...state.rows, { ...a, id: Date.now(), staffNo: staffLabel(state.nextNo), caseload: 0 }],
    nextNo: state.nextNo + 1,
  };
  emit();
}

export function updateAttorney(id, patch) {
  state = { ...state, rows: state.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)) };
  emit();
}

export function removeAttorney(id) {
  state = { ...state, rows: state.rows.filter((r) => r.id !== id) };
  emit();
}

