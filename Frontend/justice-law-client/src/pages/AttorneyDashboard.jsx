/*
  AttorneyDashboard.jsx

  Exports:
    default -> AttorneyDashboard (my cases, client, case details)
    named   -> LegalTasksPage    (Legal Activity & Milestone Tracker)

  Routes (App.jsx):
    /attorney        -> AttorneyDashboard
    /attorney/tasks  -> LegalTasksPage

  Props:
    withShell (default true) draws the sidebar and top bar.
    Use withShell={false} if the page sits inside a shared layout.

  Mock data only. Replace CASES / CLIENTS / TRACKER_TASKS with API calls later.
*/
import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

/* ================= Routes and navigation ================= */
const ROUTES = {
  dashboard: '/attorney',
  clients: '/attorney/clients',
  cases: '/attorney/cases',
  tasks: '/attorney/tasks',
  research: '/attorney/settings',
};

/* Attorney-only navigation */
const NAV = [
  { label: 'Overview / Dashboard', icon: 'grid', to: ROUTES.dashboard },
  { label: 'Clients Management', icon: 'users', to: ROUTES.clients },
  { label: 'Cases & Dockets', icon: 'folder', to: ROUTES.cases },
  { label: 'Legal Tasks & Activities', icon: 'check', to: ROUTES.tasks },
  { label: 'Research & Settings', icon: 'book', to: ROUTES.research },
];

/* ================= Mock data ================= */
const ATTORNEY = {
  name: 'Adv. Thabo Sithole',
  short: 'Adv. T. Sithole',
  title: 'Senior Counsel',
  initials: 'TS',
  staffId: 'STF-102',
  role: 'Counsel Partner',
  practice: 'Commercial & Corporate Litigation — Johannesburg Chambers',
  barRoll: '2011/SC-589',
  security: 'Master Security Lvl IV',
  active: 6,
  max: 8,
};

const CLIENTS = {
  vance: {
    id: 'CLI-4029', name: 'Eleanor Vance', kind: 'Principal / Natural Person', company: 'Vance Tech Holdings (Pty) Ltd',
    idNo: '880419 0122 083', email: 'e.vance@vancetech.co.za', phone: '+27 (0)82 441 9081',
    address: 'Sandhurst Corporate Enclave, Sandton', retainer: 'R 185,000.00', trust: 'STB-88019-LAW', initials: 'EV',
  },
  sterling: {
    id: 'CLI-5110', name: 'Sterling Logistics Ltd', kind: 'Corporate / Commercial', company: 'Sterling Logistics Ltd',
    idNo: '2014/194021/07', email: 'legal@sterlinglog.co.za', phone: '+27 (0)11 880 2900',
    address: 'Midrand Business Park, Midrand', retainer: 'R 120,000.00', trust: 'STB-51100-LAW', initials: 'SL',
  },
  archer: {
    id: 'CLI-2094', name: 'Claire Archer-Smit', kind: 'Natural Person', company: 'Cape Wineries',
    idNo: '820314 0041 089', email: 'claire.archer@capewineries.com', phone: '+27 (0)83 552 1198',
    address: 'Cape Winelands Estate, Stellenbosch', retainer: 'R 45,000.00', trust: 'STB-20940-LAW', initials: 'CA',
  },
  transglobal: {
    id: 'CLI-1190', name: 'TransGlobal Capital PLC', kind: 'Foreign Corp Entity', company: 'TransGlobal Capital PLC',
    idNo: 'UK-CR-8921104', email: 'dossiers@transglobalcap.co.uk', phone: '+44 20 7946 0912',
    address: 'London, United Kingdom', retainer: 'R 310,000.00', trust: 'STB-11900-LAW', initials: 'TG',
  },
};

const CASES = [
  {
    id: 1, ref: 'CAS-2024-0891', title: 'Vanderbilt Asset Restructuring', type: 'Commercial Law',
    label: 'In Progress', group: 'In Progress', clientKey: 'vance', clientLabel: 'Vance Tech Holdings (Eleanor Vance)', clientIcon: 'building',
    meta: { icon: 'calendar', text: '28 Apr 2024' },
    detail: {
      priority: 'High Priority', caseNo: '2024/09182', court: 'High Court Johannesburg (Gauteng Local Division)',
      milestones: ['1. Summons Issued', '2. Notice of Motion', '3. Replying Affidavit', '4. Enrolled Hearing'], step: 3, note: 'Motion Hearing in 6 Days',
      seat: 'High Court of South Africa', seat2: 'Gauteng Local Division (JHB)', judge: 'Judge Sutherland', judge2: 'Deputy Judge President',
      opened: '12 Jan 2024', compliance: 'Rule 35(12) Compliance Pending',
      summary: 'Multi-jurisdictional commercial dispute regarding the alleged breach of an asset acquisition covenant under Section 42 of the South African Companies Act. Applicant seeks an urgent interlocutory interdict freezing corporate equity transfers pending the full forensic discovery of audited ledger supplements for Q3-Q4 2023. Senior counsel settlement conferences are scheduled ahead of the contested motion court roll on 28 April 2024.',
      tasks: [
        { title: 'Draft Replying Affidavit', desc: 'Rule 35(12) High Court Discovery', due: 'Due Tomorrow', tone: 'red', icon: 'clock' },
        { title: 'Review Forensic Audit', desc: 'Asset Schedule B Valuations', due: 'Due 30 Apr', tone: 'grey', icon: 'circle' },
        { title: 'Client Briefing & Settlement', desc: 'Strategy Conference with E. Vance', due: '20 Apr', tone: 'done', icon: 'checkcircle' },
      ],
      filings: [
        { name: 'Notice_of_Motion_Urgent.pdf', meta: 'Filed 15 Mar 2024 • 4.2 MB', icon: 'file', action: 'download' },
        { name: 'Founding_Affidavit_Vance_Sworn.pdf', meta: 'Commissioner Stamp • 18 Mar 2024', icon: 'file', action: 'download' },
        { name: 'Settlement_Proposal_Confidential.pdf', meta: 'Without Prejudice • 14 Apr 2024', icon: 'lock', action: 'eye' },
      ],
    },
  },
  {
    id: 2, ref: 'CAS-2024-0944', title: 'Apex Logistics vs TransRail Arbitration', type: 'Labor & Commercial',
    label: 'In Progress', group: 'In Progress', clientKey: 'sterling', clientLabel: 'Sterling Logistics Ltd', clientIcon: 'building',
    meta: { icon: 'calendar', text: '15 May 2024' },
    detail: {
      caseNo: '2024/11206', court: 'Labour Appeal Court',
      milestones: ['1. Referral Lodged', '2. Pleadings Exchanged', '3. Pre-Arbitration Conference', '4. Arbitration Sitting'], step: 2, note: 'Arbitration on 12 May',
      seat: 'Labour Appeal Court', seat2: 'Johannesburg Seat', judge: 'Arbitrator to be confirmed', judge2: 'Panel appointment pending',
      opened: '28 Feb 2024', compliance: 'Pleadings Exchange Pending',
      summary: 'Arbitration between Apex Logistics and TransRail concerning an alleged breach of a freight services agreement. Bargaining council referral and pleadings are being prepared ahead of the 12 May sitting.',
      tasks: [
        { title: 'Prepare Statement of Case', desc: 'Freight services agreement breach', due: 'Due 22 Apr', tone: 'grey', icon: 'circle' },
        { title: 'Witness Preparation', desc: 'Operations manager and finance lead', due: 'Due 03 May', tone: 'grey', icon: 'circle' },
      ],
      filings: [{ name: 'Referral_Form_Bargaining_Council.pdf', meta: 'Filed 02 Mar 2024 • 1.1 MB', icon: 'file', action: 'download' }],
    },
  },
  {
    id: 3, ref: 'CAS-2024-1055', title: 'Helios Solar Infrastructure Breach', type: 'Civil Law',
    label: 'Pending Hearing', group: 'Pending Hearing', clientKey: 'archer', clientLabel: 'Claire Archer-Smit', clientIcon: 'user',
    meta: { icon: 'check', text: 'Pleadings Closed' },
    detail: {
      caseNo: '2024/15733', court: 'High Court of South Africa (Provincial Division)',
      milestones: ['1. Summons Issued', '2. Pleadings Closed', '3. Hearing Date Allocated', '4. Trial'], step: 2, note: 'Awaiting hearing date',
      seat: 'High Court of South Africa', seat2: 'Provincial Division', judge: 'To be allocated', judge2: 'Hearing date pending',
      opened: '02 Apr 2024', compliance: 'Pleadings Closed',
      summary: 'Civil claim for breach of a solar infrastructure supply contract. Pleadings are closed and the matter is awaiting allocation of a hearing date.',
      tasks: [{ title: 'Request Hearing Date', desc: 'Application to the Registrar', due: 'Due 26 Apr', tone: 'grey', icon: 'circle' }],
      filings: [{ name: 'Particulars_of_Claim.pdf', meta: 'Filed 05 Apr 2024 • 2.3 MB', icon: 'file', action: 'download' }],
    },
  },
  {
    id: 4, ref: 'CAS-2023-0419', title: 'Khumalo Mineral Concession Deeds', type: 'Property Law',
    label: 'Review', group: 'In Progress', clientKey: 'transglobal', clientLabel: 'TransGlobal Capital PLC', clientIcon: 'building',
    meta: { icon: 'file', text: 'Deeds Office' }, detail: { opened: '19 Nov 2023' },
  },
  {
    id: 5, ref: 'CAS-2024-1120', title: 'Metropolitan Fleet Supply Dispute', type: 'Commercial Law',
    label: 'Open', group: 'Open', clientKey: 'vance', clientLabel: 'Vance Tech Holdings', clientIcon: 'building',
    meta: { icon: 'file', text: 'Summons Drafted' }, detail: { opened: '20 Apr 2024' },
  },
  {
    id: 6, ref: 'CAS-2024-1203', title: 'Sterling Logistics Employment Contract Review', type: 'Labor Law',
    label: 'In Progress', group: 'In Progress', clientKey: 'sterling', clientLabel: 'Sterling Logistics Ltd', clientIcon: 'building',
    meta: { icon: 'calendar', text: '30 May 2024' }, detail: { opened: '02 May 2024' },
  },
];

const GENERIC_MILESTONES = ['1. Matter Opened', '2. Pleadings', '3. Hearing Preparation', '4. Hearing / Outcome'];

const TRACKER_TASKS = [
  { id: 'TSK-8820', title: 'Draft Share Purchase Agreement', desc: 'Incorporates indemnity clauses and shareholder restructuring annexures.', date: '24 Oct 2024', dateNote: 'Archived in Court Vault', dateTone: 'ok', counsel: 'Adv. T. Sithole', counselNote: 'Validated & Sealed', status: 'Completed' },
  { id: 'TSK-8835', title: 'Prepare Affidavit for High Court Discovery', desc: 'Rule 35(1) financial declaration documentation and balance audit filing.', date: 'Due 04 Nov 2024', dateNote: 'Filing Deadline Imminent', dateTone: 'warn', counsel: 'Adv. T. Sithole', counselNote: 'Drafting in Progress', status: 'In Progress' },
  { id: 'TSK-8840', title: 'Schedule Client Pre-Trial Consultation', desc: 'Comprehensive strategy review with lead counsel ahead of formal motion.', date: 'Due 08 Nov 2024', dateNote: 'Sandton Chambers or Virtual', dateTone: 'muted', counsel: 'Adv. T. Sithole / Registry', counselNote: 'Awaiting Diary Allocation', status: 'In Progress' },
  { id: 'TSK-8841', title: 'File Master Court Documentation', desc: 'Registrar endorsement and official service to counterpart attorneys.', date: 'Due 15 Nov 2024', dateNote: 'Dependent on TSK-8835', dateTone: 'muted', counsel: 'High Court Registrar Clerk', counselNote: 'Pending Service Docket', status: 'Not Started' },
];

const TRACKER_FILTERS = [
  { key: 'All Tasks', match: () => true },
  { key: 'In Progress', match: (t) => t.status === 'In Progress' },
  { key: 'Completed', match: (t) => t.status === 'Completed' },
  { key: 'Pending Schedule', match: (t) => t.status === 'Not Started' },
];

const CASE_FILTERS = ['All', 'In Progress', 'Pending Hearing', 'Open'];

/* ================= Icons (inline SVG, no extra package) ================= */
const ICONS = {
  grid: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>',
  users: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  folder: '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  check: '<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
  bell: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  mail: '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>',
  phone: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  pin: '<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',
  eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  plus: '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>',
  clock: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  lock: '<rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  arrow: '<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>',
  circle: '<circle cx="12" cy="12" r="9"/>',
  checkcircle: '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  building: '<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="9" y1="22" x2="9" y2="18"/><line x1="15" y1="22" x2="15" y2="18"/><line x1="8" y1="6" x2="8.01" y2="6"/><line x1="12" y1="6" x2="12.01" y2="6"/><line x1="16" y1="6" x2="16.01" y2="6"/><line x1="8" y1="10" x2="8.01" y2="10"/><line x1="12" y1="10" x2="12.01" y2="10"/><line x1="16" y1="10" x2="16.01" y2="10"/>',
  user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  scales: '<line x1="12" y1="3" x2="12" y2="21"/><line x1="5" y1="21" x2="19" y2="21"/><line x1="4" y1="7" x2="20" y2="7"/><path d="M4 7l-3 7a3 3 0 0 0 6 0z"/><path d="M20 7l-3 7a3 3 0 0 0 6 0z"/>',
};

function Icon({ name, size = 16 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: ICONS[name] }}
    />
  );
}

/* ================= Styles (scoped with the jl- prefix) ================= */
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');

/* Base */
.jl{font-family:'DM Sans',system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;background:#f6f7fb;min-height:100vh;display:flex;font-size:14px;line-height:1.4}
.jl *{box-sizing:border-box}
.jl button{font-family:inherit}
.jl-mono{font-family:'JetBrains Mono',ui-monospace,monospace}
.jl-orange{color:#c2410c !important}
.jl-muted{color:#64748b;font-size:12px}
.jl-lbl{font-size:10px;letter-spacing:.08em;font-weight:700;color:#64748b}
.jl-empty{padding:24px 8px;text-align:center;color:#64748b;font-size:13px}

/* Sidebar */
.jl-side{width:244px;flex:0 0 244px;background:#0f1729;color:#cbd5e1;display:flex;flex-direction:column;padding:20px 14px;position:sticky;top:0;height:100vh}
.jl-logo{display:flex;align-items:center;gap:10px;padding:0 8px 22px;color:#f59e0b}
.jl-logo b{display:block;color:#fff;font-size:15px;letter-spacing:.06em;line-height:1.1}
.jl-logo small{color:#f59e0b;font-size:10px;letter-spacing:.16em;font-weight:700}
.jl-sec{font-size:10px;letter-spacing:.14em;color:#64748b;padding:0 10px 8px;font-weight:600}
.jl-nav{display:flex;flex-direction:column;gap:4px}
.jl-nav a{display:flex;gap:10px;align-items:center;padding:10px 12px;border-radius:8px;color:#94a3b8;text-decoration:none;font-weight:500}
.jl-nav a:hover{background:rgba(255,255,255,.06);color:#fff}
.jl-nav a.on{background:#dbeafe;color:#0f1729;font-weight:600}
.jl-sidefoot{margin-top:auto;font-size:11px;color:#64748b;padding:0 10px}
.jl-sidefoot div:first-child{display:flex;justify-content:space-between;letter-spacing:.08em}
.jl-sidefoot b{color:#f59e0b}

/* Top bar and page frame */
.jl-main{flex:1;min-width:0;display:flex;flex-direction:column}
.jl-top{display:flex;align-items:center;gap:14px;padding:14px 24px}
.jl-gs{flex:1;max-width:480px;position:relative}
.jl-gs svg{position:absolute;left:12px;top:50%;transform:translateY(-50%);color:#64748b}
.jl-gs input{width:100%;border:0;background:#eaf0fb;border-radius:8px;padding:9px 12px 9px 36px;font:inherit;color:#0f172a}
.jl-gs input::placeholder{color:#64748b}
.jl-topr{margin-left:auto;display:flex;align-items:center;gap:14px}
.jl-cp{display:inline-flex;gap:6px;align-items:center;padding:4px 10px;background:#fff7ed;border:1px solid #fed7aa;color:#c2410c;border-radius:999px;font-size:11px;font-weight:600}
.jl-cp i{width:6px;height:6px;border-radius:50%;background:#f59e0b}
.jl-bell{position:relative;color:#334155;display:grid;place-items:center}
.jl-bell::after{content:'';position:absolute;top:-2px;right:-2px;width:7px;height:7px;border-radius:50%;background:#f59e0b}
.jl-me{display:flex;gap:10px;align-items:center;text-align:right}
.jl-me b{display:block;font-size:12px}
.jl-me small{color:#c2410c;font-size:11px;font-weight:600}
.jl-av{width:36px;height:36px;border-radius:50%;background:#0f1729;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700}
.jl-page{padding:0 24px 32px;display:flex;flex-direction:column;gap:16px}
.jl-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}

/* Profile header and KPIs */
.jl-prof{background:#fff;border:1px solid #e5e7eb;border-left:4px solid #f59e0b;border-radius:12px;padding:16px 20px;display:flex;gap:20px;flex-wrap:wrap;align-items:center;justify-content:space-between}
.jl-prof-l{display:flex;gap:16px;align-items:center;min-width:280px}
.jl-ava{width:64px;height:64px;border-radius:12px;background:#0f1729;color:#fff;display:grid;place-items:center;font-size:20px;font-weight:700;position:relative;flex:0 0 64px}
.jl-ava::after{content:'';position:absolute;right:-4px;bottom:-4px;width:16px;height:16px;border-radius:50%;background:#f59e0b;border:2px solid #fff}
.jl-prof h1{margin:0 0 4px;font-size:20px;font-weight:700;display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.jl-idchip{font-size:10px;font-weight:700;background:#e6edfb;color:#1e3a8a;border-radius:5px;padding:2px 6px}
.jl-role{font-size:10px;font-weight:700;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;border-radius:5px;padding:1px 6px}
.jl-sub{color:#475569;font-size:13px}
.jl-sub2{display:flex;gap:14px;flex-wrap:wrap;color:#64748b;font-size:12px;margin-top:6px}
.jl-sub2 span{display:inline-flex;gap:5px;align-items:center}
.jl-kpis{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));background:#f8faff;border:1px solid #e5e7eb;border-radius:10px;flex:1 1 680px;max-width:800px}
.jl-kpi{padding:12px 16px;border-right:1px solid #e5e7eb;min-width:0}
.jl-kpi:last-child{border-right:0}
.jl-kl{display:flex;gap:5px;align-items:center;font-size:10px;letter-spacing:.08em;font-weight:700;color:#475569}
.jl-kv{font-size:12px;color:#475569;margin:2px 0;white-space:nowrap}
.jl-kv b{font-size:24px;color:#0f172a;font-weight:700}
.jl-km{font-size:11px;color:#64748b}
.jl-bar{height:5px;background:#e2e8f0;border-radius:99px;margin:4px 0;overflow:hidden}
.jl-bar i{display:block;height:100%;background:#0f1729;border-radius:99px}

/* Layout, headings, chips */
.jl-grid{display:grid;grid-template-columns:minmax(300px,390px) 1fr;gap:16px;align-items:start}
.jl-grid>div{min-width:0}
.jl-h2{margin:0;font-size:15px;font-weight:700}
.jl-h2.ic{display:flex;gap:8px;align-items:center}
.jl-hd{display:flex;justify-content:space-between;align-items:center;gap:8px}
.jl-total{font-size:11px;font-weight:700;background:#e6edfb;color:#1e3a8a;border-radius:6px;padding:2px 8px}
.jl-csearch{position:relative;margin:12px 0 10px}
.jl-csearch svg{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#64748b}
.jl-csearch input{width:100%;border:1px solid #e2e8f0;background:#f8faff;border-radius:8px;padding:9px 12px 9px 34px;font:inherit;font-size:13px}
.jl-chips{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px}
.jl-chip{padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#0f172a}
.jl-chip.on{background:#0f1729;color:#fff;border-color:#0f1729}

/* Case list */
.jl-list{display:flex;flex-direction:column;gap:2px}
.jl-ci{width:100%;text-align:left;background:transparent;border:1px solid transparent;border-bottom:1px solid #eef0f4;border-radius:8px;padding:12px;cursor:pointer;color:inherit}
.jl-ci:hover{background:#f8faff}
.jl-ci.on{background:#fff;border:1px solid #e5e7eb;border-left:4px solid #f59e0b;box-shadow:0 2px 10px rgba(15,23,42,.07)}
.jl-ci1{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.jl-ref{font-size:11px;font-weight:700;color:#c2410c}
.jl-tag{font-size:10px;font-weight:600;background:#e6edfb;color:#1e3a8a;border-radius:5px;padding:1px 7px}
.jl-ml{margin-left:auto}
.jl-ci2{font-size:14px;font-weight:700;margin:6px 0 4px}
.jl-ci3{display:flex;justify-content:space-between;gap:8px;font-size:11px;color:#64748b}
.jl-ci3 span{display:inline-flex;gap:5px;align-items:center;min-width:0}
.jl-st{display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap}
.jl-st i{width:6px;height:6px;border-radius:50%;background:currentColor;display:inline-block}
.jl-st-prog{background:#eef0ff;color:#4338ca}
.jl-st-pend{background:#eff6ff;color:#2563eb}
.jl-st-rev{background:#eaf0fb;color:#3b4a6b}
.jl-st-open{background:#f1f5f9;color:#0f172a}

/* Case details */
.jl-dh{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-start}
.jl-dref{display:flex;gap:8px;align-items:center;flex-wrap:wrap;font-size:11px;font-weight:700;color:#c2410c}
.jl-prio{background:#fee2e2;color:#b91c1c;border-radius:6px;padding:2px 8px;font-size:11px;font-weight:700}
.jl-dh h2{margin:8px 0 6px;font-size:30px;line-height:1.1;font-weight:700;max-width:440px}
.jl-btns{display:flex;gap:8px;flex-wrap:wrap}
.jl-btn{padding:8px 14px;border-radius:8px;border:1px solid #e2e8f0;background:#fff;color:#0f172a;font-size:12px;font-weight:600;cursor:pointer;display:inline-flex;gap:6px;align-items:center;text-decoration:none}
.jl-btn.dark{background:#0f1729;color:#fff;border-color:#0f1729}
.jl-ms{background:#f6f8fc;border-radius:10px;padding:12px 14px;margin-top:16px}
.jl-ms-h{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.1em;font-weight:700;color:#475569;margin-bottom:8px}
.jl-ms-bar,.jl-ms-lb{display:grid;grid-template-columns:repeat(4,1fr);gap:4px}
.jl-ms-bar i{height:4px;border-radius:99px;background:#e2e8f0}
.jl-ms-bar i.d{background:#0f1729}
.jl-ms-bar i.c{background:#f59e0b}
.jl-ms-lb span{font-size:11px;color:#475569;margin-top:6px}
.jl-ms-lb span.c{color:#c2410c;font-weight:600}

/* Client and retainer */
.jl-cl{display:grid;grid-template-columns:1fr 230px;gap:16px;margin-top:12px}
.jl-cl-i{display:flex;gap:12px}
.jl-cl-av{width:54px;height:54px;border-radius:10px;background:#e6edfb;color:#1e3a8a;display:grid;place-items:center;font-weight:700;flex:0 0 54px}
.jl-cl-i b{font-size:15px}
.jl-cl-l{display:flex;flex-direction:column;gap:3px;margin-top:6px;font-size:12px;color:#475569}
.jl-cl-l span{display:flex;gap:6px;align-items:center;min-width:0;overflow-wrap:anywhere}
.jl-ret{background:#f1f6ff;border:1px solid #dbe6fb;border-radius:10px;padding:12px}
.jl-ret-h{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.06em;font-weight:700;color:#475569}
.jl-ret-h em{font-style:normal;color:#15803d;display:inline-flex;gap:4px;align-items:center}
.jl-ret-v{font-size:21px;font-weight:700;margin:6px 0 2px}
.jl-ret .jl-btns{margin-top:10px}
.jl-ret .jl-btn{flex:1;justify-content:center}

/* Judicial brief, tasks preview, filings */
.jl-jp{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;background:#f6f8fc;border-radius:10px;padding:12px 14px;margin:12px 0}
.jl-jp b{display:block;font-size:14px;margin-top:2px}
.jl-sum{font-size:13px;color:#334155;margin:6px 0 0}
.jl-two{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.jl-ti{display:flex;gap:10px;align-items:flex-start;padding:10px;border-radius:8px;background:#f6f8fc;margin-top:8px}
.jl-tic{width:26px;height:26px;border-radius:50%;display:grid;place-items:center;flex:0 0 26px;background:#e2e8f0;color:#475569}
.jl-tic.red{background:#fee2e2;color:#dc2626}
.jl-tic.done{background:#dcfce7;color:#15803d}
.jl-tt{flex:1;min-width:0}
.jl-tt b{font-size:13px;display:block}
.jl-tt.done b{text-decoration:line-through;color:#64748b}
.jl-tt small{color:#64748b;font-size:11px}
.jl-due{font-size:10px;font-weight:700;border-radius:6px;padding:2px 7px;background:#e2e8f0;color:#475569;white-space:nowrap}
.jl-due.red{background:#fee2e2;color:#b91c1c}
.jl-due.done{background:transparent;color:#64748b;font-weight:600}
.jl-fi{display:flex;gap:10px;align-items:center;padding:10px;border-radius:8px;background:#f6f8fc;margin-top:8px}
.jl-fic{width:30px;height:30px;border-radius:8px;background:#e6edfb;color:#1e3a8a;display:grid;place-items:center;flex:0 0 30px}
.jl-fi .jl-tt b{font-size:12px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.jl-fi button{background:none;border:0;color:#64748b;cursor:pointer;padding:4px}
.jl-fi button:hover{color:#0f172a}
.jl-more{display:inline-flex;gap:6px;align-items:center;margin-top:12px;font-size:12px;font-weight:700;color:#c2410c;text-decoration:none;background:none;border:0;cursor:pointer;padding:0}
.jl-ed{font-size:10px;font-weight:600;background:#f1f5f9;border-radius:5px;padding:2px 6px;color:#475569}

/* Legal tasks page */
.jl-ph{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;align-items:flex-end}
.jl-ph h1{margin:4px 0 0;font-size:28px;font-weight:700}
.jl-fin{background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:10px 14px;min-width:240px}
.jl-fin div:first-child{display:flex;justify-content:space-between;font-size:10px;letter-spacing:.08em;font-weight:700;color:#475569}
.jl-fin b{color:#c2410c;font-size:15px}
.jl-fin .jl-bar i{background:#f59e0b}
.jl-tw{overflow-x:auto;margin-top:12px}
.jl-table{width:100%;border-collapse:collapse;min-width:760px}
.jl-table th{text-align:left;font-size:10px;letter-spacing:.08em;color:#64748b;font-weight:700;padding:10px 12px;border-bottom:1px solid #e5e7eb}
.jl-table td{padding:14px 12px;border-bottom:1px solid #eef0f4;vertical-align:top;font-size:13px}
.jl-table td b{display:block;font-size:14px}
.jl-table small{display:block;color:#64748b;font-size:11px;margin-top:2px}
.jl-tid{font-size:12px;font-weight:600;color:#c2410c}
.jl-tid.muted{color:#64748b}
.jl-tone-ok{color:#15803d !important}
.jl-tone-warn{color:#c2410c !important}
.jl-stat{display:inline-block;border-radius:999px;font-size:10px;font-weight:700;letter-spacing:.04em;padding:3px 10px;white-space:nowrap}
.jl-stat.completed{background:#dcfce7;color:#15803d}
.jl-stat.inprogress{background:#fef3c7;color:#b45309}
.jl-stat.notstarted{background:#f1f5f9;color:#475569}
.jl-notice{background:#f1f6ff;border:1px solid #dbe6fb;border-radius:10px;padding:14px 16px;margin-top:14px;font-size:12px;color:#475569}
.jl-notice b{display:block;color:#0f172a;font-size:13px;margin-bottom:4px}

/* Width fixes: stop content overflowing the layout */
.jl{width:100%;min-width:0;max-width:100%}
.jl-main,.jl-page{min-width:0;max-width:100%}
.jl-grid{grid-template-columns:minmax(300px,390px) minmax(0,1fr)}
.jl-two{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.jl-cl{grid-template-columns:minmax(0,1fr) 230px}
.jl-two>*,.jl-cl>*{min-width:0}
.jl-kpis{min-width:0}

/* Responsive */
@media (max-width:1100px){.jl-grid,.jl-two,.jl-cl{grid-template-columns:1fr}}
@media (max-width:900px){.jl{flex-direction:column}.jl-side{width:auto;flex:none;height:auto;position:static}.jl-jp{grid-template-columns:1fr}}
`;

/* ================= Shared shell: sidebar + top bar ================= */
function Shell({ withShell, children }) {
  const { pathname } = useLocation();

  const isActive = (to) =>
    to === ROUTES.dashboard
      ? pathname === to || pathname === `${to}/`
      : pathname.startsWith(to);

  if (!withShell) {
    return (
      <>
        <style>{CSS}</style>
        <div className="jl">
          <div className="jl-main">
            <div className="jl-page">{children}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="jl">
        <aside className="jl-side">
          <div className="jl-logo">
            <Icon name="scales" size={30} />
            <div>
              <b>JUSTICELAW</b>
              <small>ATTORNEYS</small>
            </div>
          </div>
          <div className="jl-sec">LEGAL OPERATIONS</div>
          <nav className="jl-nav" aria-label="Attorney navigation">
            {NAV.map((item) => (
              <Link key={item.to} to={item.to} className={isActive(item.to) ? 'on' : ''}>
                <Icon name={item.icon} size={16} />
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="jl-sidefoot">
            <div>
              <span>JURISDICTION</span>
              <b>High Court</b>
            </div>
            <div>Docket Filing Sync: Active</div>
          </div>
        </aside>

        <div className="jl-main">
          <header className="jl-top">
            <div className="jl-gs">
              <Icon name="search" size={15} />
              <input placeholder="Search docket, clients, matters..." aria-label="Search docket, clients, matters" />
            </div>
            <div className="jl-topr">
              <span className="jl-cp">
                <i />
                {ATTORNEY.role}
              </span>
              <span className="jl-bell" aria-label="Notifications">
                <Icon name="bell" size={18} />
              </span>
              <div className="jl-me">
                <div>
                  <b>{ATTORNEY.short}</b>
                  <small>{ATTORNEY.title}</small>
                </div>
                <div className="jl-av">{ATTORNEY.initials}</div>
              </div>
            </div>
          </header>
          <div className="jl-page">{children}</div>
        </div>
      </div>
    </>
  );
}

/* ================= Small shared pieces ================= */
const STATUS_CLASS = { 'In Progress': 'prog', 'Pending Hearing': 'pend', Review: 'rev', Open: 'open' };

function StatusPill({ label, className = '' }) {
  return (
    <span className={`jl-st jl-st-${STATUS_CLASS[label] || 'open'} ${className}`}>
      <i />
      {label}
    </span>
  );
}

/* ================= Page 1: Attorney dashboard ================= */
export default function AttorneyDashboard({ withShell = false }) {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(CASES[0].id);

  const counts = useMemo(
    () => ({
      All: CASES.length,
      'In Progress': CASES.filter((c) => c.group === 'In Progress').length,
      'Pending Hearing': CASES.filter((c) => c.group === 'Pending Hearing').length,
      Open: CASES.filter((c) => c.group === 'Open').length,
    }),
    []
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return CASES.filter(
      (c) =>
        (filter === 'All' || c.group === filter) &&
        `${c.ref} ${c.title} ${c.clientLabel}`.toLowerCase().includes(q)
    );
  }, [query, filter]);

  const selected = CASES.find((c) => c.id === selectedId) || CASES[0];
  const d = selected.detail || {};
  const client = CLIENTS[selected.clientKey];
  const milestones = d.milestones || GENERIC_MILESTONES;
  const step = d.step || 1;
  const tasks = d.tasks || [];
  const filings = d.filings || [];
  const pct = Math.round((ATTORNEY.active / ATTORNEY.max) * 100);

  return (
    <Shell withShell={withShell}>
      {/* Profile header */}
      <section className="jl-prof">
        <div className="jl-prof-l">
          <div className="jl-ava">{ATTORNEY.initials}</div>
          <div>
            <h1>
              {ATTORNEY.name}
              <span className="jl-idchip">ID #{ATTORNEY.staffId}</span>
              <span className="jl-role">{ATTORNEY.role}</span>
            </h1>
            <div className="jl-sub">{ATTORNEY.practice}</div>
            <div className="jl-sub2">
              <span>
                <Icon name="scales" size={13} /> Bar Roll No: {ATTORNEY.barRoll}
              </span>
              <span>
                <Icon name="shield" size={13} /> {ATTORNEY.security}
              </span>
            </div>
          </div>
        </div>

        <div className="jl-kpis">
          <div className="jl-kpi">
            <div className="jl-kl">
              <Icon name="briefcase" size={12} /> ACTIVE CASES
            </div>
            <div className="jl-kv">
              <b>{ATTORNEY.active}</b> / {ATTORNEY.max} Max
            </div>
            <div className="jl-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="jl-km">{pct}% Caseload cap</div>
          </div>
          <div className="jl-kpi">
            <div className="jl-kl">
              <Icon name="scales" size={12} /> COURT DATES
            </div>
            <div className="jl-kv">
              <b className="jl-orange">2</b> Imminent
            </div>
            <div className="jl-km">28 Apr: Motion Court</div>
            <div className="jl-km">12 May: Arbitration</div>
          </div>
          <div className="jl-kpi">
            <div className="jl-kl">
              <Icon name="file" size={12} /> OPEN TASKS
            </div>
            <div className="jl-kv">
              <b>9</b> <span className="jl-orange">1 Due 24h</span>
            </div>
            <div className="jl-km">Across 4 matters</div>
            <div className="jl-km">3 Affidavits ready</div>
          </div>
          <div className="jl-kpi">
            <div className="jl-kl">
              <Icon name="clock" size={12} /> BILLED MTD
            </div>
            <div className="jl-kv">
              <b>42.5</b> Hours
            </div>
            <div className="jl-km">Target: 60 hrs</div>
            <div className="jl-km">Avg R 5,200/hr</div>
          </div>
        </div>
      </section>

      <div className="jl-grid">
        {/* Left: my assigned cases */}
        <div>
          <section className="jl-card">
            <div className="jl-hd">
              <div>
                <h2 className="jl-h2">My Assigned Cases</h2>
                <div className="jl-muted">Active judicial &amp; advisory dockets</div>
              </div>
              <span className="jl-total">{CASES.length} Total</span>
            </div>

            <div className="jl-csearch">
              <Icon name="search" size={14} />
              <input
                placeholder="Search docket, case ID, or client..."
                aria-label="Search my cases"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="jl-chips" role="group" aria-label="Filter cases by status">
              {CASE_FILTERS.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`jl-chip${filter === f ? ' on' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f} ({counts[f]})
                </button>
              ))}
            </div>

            <div className="jl-list">
              {visible.length === 0 && <div className="jl-empty">No dockets match your search.</div>}
              {visible.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`jl-ci${c.id === selected.id ? ' on' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="jl-ci1">
                    <span className="jl-ref">{c.ref}</span>
                    <span className="jl-tag">{c.type}</span>
                    <StatusPill label={c.label} className="jl-ml" />
                  </div>
                  <div className="jl-ci2">{c.title}</div>
                  <div className="jl-ci3">
                    <span>
                      <Icon name={c.clientIcon} size={12} /> {c.clientLabel}
                    </span>
                    <span>
                      <Icon name={c.meta.icon} size={12} /> {c.meta.text}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right: selected case details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <section className="jl-card">
            <div className="jl-dh">
              <div>
                <div className="jl-dref">
                  <span>{selected.ref}</span>
                  <StatusPill label={selected.label} />
                  {d.priority && <span className="jl-prio">! {d.priority}</span>}
                </div>
                <h2>{selected.title}</h2>
                <div className="jl-muted">
                  {d.court || 'High Court'} — Case No: {d.caseNo || '—'}
                </div>
              </div>
              <div className="jl-btns">
                <button type="button" className="jl-btn">
                  <Icon name="download" size={14} /> Export Dossier
                </button>
                <Link to={ROUTES.tasks} className="jl-btn dark">
                  <Icon name="plus" size={14} /> Log Activity
                </Link>
              </div>
            </div>

            <div className="jl-ms">
              <div className="jl-ms-h">
                <span>MATTER MILESTONES</span>
                {d.note && <span className="jl-orange">{d.note}</span>}
              </div>
              <div className="jl-ms-bar">
                {milestones.map((m, i) => (
                  <i key={m} className={i + 1 < step ? 'd' : i + 1 === step ? 'c' : ''} />
                ))}
              </div>
              <div className="jl-ms-lb">
                {milestones.map((m, i) => (
                  <span key={m} className={i + 1 === step ? 'c' : ''}>
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </section>

          <section className="jl-card">
            <div className="jl-hd">
              <h2 className="jl-h2 ic">
                <Icon name="user" size={16} /> Primary Linked Client &amp; Retainer Profile
              </h2>
              <span className="jl-total">{client.id}</span>
            </div>
            <div className="jl-cl">
              <div className="jl-cl-i">
                <div className="jl-cl-av">{client.initials}</div>
                <div style={{ minWidth: 0 }}>
                  <b>{client.name}</b>
                  <div className="jl-muted">({client.kind})</div>
                  <div className="jl-orange" style={{ fontSize: 12, fontWeight: 600 }}>
                    {client.company}
                  </div>
                  <div className="jl-cl-l">
                    <span>
                      <Icon name="briefcase" size={12} /> ID: <span className="jl-mono">{client.idNo}</span>
                    </span>
                    <span>
                      <Icon name="mail" size={12} /> {client.email}
                    </span>
                    <span>
                      <Icon name="phone" size={12} /> {client.phone}
                    </span>
                    <span>
                      <Icon name="pin" size={12} /> {client.address}
                    </span>
                  </div>
                </div>
              </div>
              <div className="jl-ret">
                <div className="jl-ret-h">
                  <span>RETAINER VAULT BALANCE</span>
                  <em>
                    <Icon name="shield" size={11} /> FICA Active
                  </em>
                </div>
                <div className="jl-ret-v jl-mono">{client.retainer}</div>
                <div className="jl-muted">Trust Account: {client.trust}</div>
                <div className="jl-btns">
                  <a className="jl-btn" href={`mailto:${client.email}`}>
                    <Icon name="mail" size={13} /> Contact
                  </a>
                  <button type="button" className="jl-btn dark">
                    <Icon name="eye" size={13} /> Dossier
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="jl-card">
            <h2 className="jl-h2 ic">
              <Icon name="scales" size={16} /> Judicial Parameters &amp; Legal Brief
            </h2>
            <div className="jl-jp">
              <div>
                <div className="jl-lbl">COURT / SEAT</div>
                <b>{d.seat || '—'}</b>
                <div className="jl-muted">{d.seat2 || ''}</div>
              </div>
              <div>
                <div className="jl-lbl">PRESIDING JURIST</div>
                <b>{d.judge || '—'}</b>
                <div className="jl-muted">{d.judge2 || ''}</div>
              </div>
              <div>
                <div className="jl-lbl">OPENING DATE &amp; STATUS</div>
                <b>{d.opened || '—'}</b>
                <div className="jl-orange" style={{ fontSize: 12, fontWeight: 600 }}>
                  {d.compliance || ''}
                </div>
              </div>
            </div>
            <div className="jl-lbl">CASE SUMMARY &amp; STRATEGIC CONTEXT</div>
            <p className="jl-sum">{d.summary || 'No case summary has been captured for this docket yet.'}</p>
          </section>

          <div className="jl-two">
            <section className="jl-card">
              <div className="jl-hd">
                <h2 className="jl-h2 ic">
                  <Icon name="check" size={16} /> Legal Tasks Preview
                </h2>
                <span className="jl-total">{tasks.length} Tasks</span>
              </div>
              {tasks.length === 0 && <div className="jl-empty">No tasks logged for this docket yet.</div>}
              {tasks.map((t) => (
                <div key={t.title} className="jl-ti">
                  <span className={`jl-tic ${t.tone === 'red' ? 'red' : t.tone === 'done' ? 'done' : ''}`}>
                    <Icon name={t.icon} size={14} />
                  </span>
                  <div className={`jl-tt${t.tone === 'done' ? ' done' : ''}`}>
                    <b>{t.title}</b>
                    <small>{t.desc}</small>
                  </div>
                  <span className={`jl-due ${t.tone}`}>{t.due}</span>
                </div>
              ))}
              <Link to={ROUTES.tasks} className="jl-more">
                Open All 9 Counsel Tasks <Icon name="arrow" size={12} />
              </Link>
            </section>

            <section className="jl-card">
              <div className="jl-hd">
                <h2 className="jl-h2 ic">
                  <Icon name="folder" size={16} /> Docket Filings &amp; Records
                </h2>
                <span className="jl-ed jl-mono">e-Judiciary</span>
              </div>
              {filings.length === 0 && <div className="jl-empty">No filings recorded for this docket yet.</div>}
              {filings.map((f) => (
                <div key={f.name} className="jl-fi">
                  <span className="jl-fic">
                    <Icon name={f.icon} size={15} />
                  </span>
                  <div className="jl-tt">
                    <b>{f.name}</b>
                    <small>{f.meta}</small>
                  </div>
                  <button type="button" aria-label={f.action === 'eye' ? 'View filing' : 'Download filing'}>
                    <Icon name={f.action} size={15} />
                  </button>
                </div>
              ))}
              <button type="button" className="jl-more">
                Browse Full Electronic Index (14 Docs) <Icon name="arrow" size={12} />
              </button>
            </section>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ================= Page 2: Legal Tasks & Activities ================= */
export function LegalTasksPage({ withShell = false }) {
  const [filter, setFilter] = useState('All Tasks');

  const active = TRACKER_FILTERS.find((f) => f.key === filter) || TRACKER_FILTERS[0];
  const rows = TRACKER_TASKS.filter(active.match);
  const done = TRACKER_TASKS.filter((t) => t.status === 'Completed').length;
  const finalized = 4;
  const total = 6;
  const pct = Math.round((finalized / total) * 100);

  return (
    <Shell withShell={withShell}>
      <section className="jl-card">
        <div className="jl-ph">
          <div>
            <div className="jl-lbl jl-orange">ACTIVE DOCKET EXECUTION • CAS-2024-0891 Vanderbilt Asset Restructuring</div>
            <h1>{'Legal Activity & Milestone Tracker'}</h1>
          </div>
          <div className="jl-fin">
            <div>
              <span>CASE FINALIZATION TRACK</span>
              <b>{pct}%</b>
            </div>
            <div className="jl-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="jl-muted">
              {finalized} of {total} primary court milestones finalized
            </div>
          </div>
        </div>

        <div className="jl-chips" style={{ marginTop: 16, marginBottom: 0 }} role="group" aria-label="Filter tasks by status">
          {TRACKER_FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`jl-chip${filter === f.key ? ' on' : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.key} ({TRACKER_TASKS.filter(f.match).length})
            </button>
          ))}
        </div>

        <div className="jl-tw">
          <table className="jl-table">
            <thead>
              <tr>
                <th>TASK ID</th>
                <th>MILESTONE / ACTION ITEM</th>
                <th>TARGET / COMPLETION</th>
                <th>SUPERVISING COUNSEL</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={5} className="jl-empty">
                    No tasks in this view.
                  </td>
                </tr>
              )}
              {rows.map((t) => (
                <tr key={t.id}>
                  <td>
                    <span className={`jl-tid jl-mono${t.status === 'Not Started' ? ' muted' : ''}`}>{t.id}</span>
                  </td>
                  <td>
                    <b>{t.title}</b>
                    <small>{t.desc}</small>
                  </td>
                  <td>
                    {t.date}
                    <small className={t.dateTone === 'ok' ? 'jl-tone-ok' : t.dateTone === 'warn' ? 'jl-tone-warn' : ''}>
                      {t.dateNote}
                    </small>
                  </td>
                  <td>
                    {t.counsel}
                    <small>{t.counselNote}</small>
                  </td>
                  <td>
                    <span className={`jl-stat ${t.status.replace(' ', '').toLowerCase()}`}>{t.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="jl-notice">
          <b>Legal Notice &amp; Docket Integrity Protocol</b>
          Legal task timelines, statuses, and docket filings are strictly maintained and verified by JusticeLaw Attorneys
          in compliance with the Legal Practice Act (Act No. 28 of 2014) and the respective High Court Rules. {done} of{' '}
          {TRACKER_TASKS.length} listed tasks are completed.
        </div>
      </section>
    </Shell>
  );
}