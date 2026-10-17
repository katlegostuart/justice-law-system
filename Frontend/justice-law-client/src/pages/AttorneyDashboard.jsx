/*
  AttorneyDashboard.jsx  (live data version)

  Exports:
    default -> AttorneyDashboard (my assigned cases, client information, tasks per case)
    named   -> LegalTasksPage    (all my legal tasks: add, edit, record progress)
    named   -> MyCasesPage       (same case workspace without the profile header)

  Routes (App.jsx):
    /attorney             -> AttorneyDashboard
    /attorney/cases       -> MyCasesPage
    /attorney/tasks       -> LegalTasksPage
    /attorney/tasks/new   -> AttorneyTaskForm  (create a task)
    /attorney/tasks/edit/:id -> AttorneyTaskForm (edit a task)

  Data comes from DataContext, which loads it from the API. The backend only
  returns the cases and tasks that belong to the logged-in attorney.
*/
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { formatDate } from '../components/ui';
import { TASK_STATUSES, isOverdue } from '../services/taskConfig';
import api from '../services/api';
import { Modal, Form, Button, Alert } from 'react-bootstrap';

/* ================= Icons (inline SVG, no extra package) ================= */
const ICONS = {
  edit: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
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

/* Live-data additions */
.jl-st-closed{background:#e2e8f0;color:#475569}
.jl-stat.complete{background:#dcfce7;color:#15803d}
.jl-btn.sm{padding:5px 10px;font-size:11px}
.jl-pick{border:1px solid #e2e8f0;border-radius:999px;padding:3px 8px;font:inherit;font-size:11px;font-weight:700;cursor:pointer;background:#f1f5f9;color:#475569}
.jl-pick.inprogress{background:#fef3c7;color:#b45309;border-color:#fde68a}
.jl-pick.complete{background:#dcfce7;color:#15803d;border-color:#bbf7d0}
.jl-pick:disabled{opacity:.6;cursor:wait}
.jl-alert{background:#fef2f2;border:1px solid #fecaca;color:#b91c1c;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:13px}
.jl-ok{background:#f0fdf4;border:1px solid #bbf7d0;color:#15803d;border-radius:8px;padding:10px 14px;margin-top:12px;font-size:13px;display:flex;justify-content:space-between;align-items:center}
.jl-ok button{background:none;border:0;font-size:18px;line-height:1;cursor:pointer;color:inherit}
.jl-bar-tools{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;margin-top:16px}
.jl-bar-tools .jl-chips{margin-bottom:0}
.jl-filters{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}
.jl-field{border:1px solid #e2e8f0;background:#f8faff;border-radius:8px;padding:8px 12px;font:inherit;font-size:13px;min-width:200px;flex:1;max-width:340px}
.jl-cl-l a{color:#1e3a8a}
`;

/* ================= Small helpers ================= */
const initialsOf = (name) =>
  (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase() || 'A';

const byDueDate = (a, b) => (a.dueDate || '').localeCompare(b.dueDate || '');

const CASE_STATUS_CLASS = { 'In Progress': 'prog', 'Pending Hearing': 'pend', Review: 'rev', Open: 'open', Closed: 'closed' };

function CaseStatusPill({ label, className = '' }) {
  return (
    <span className={`jl-st jl-st-${CASE_STATUS_CLASS[label] || 'open'} ${className}`}>
      <i />
      {label || 'Open'}
    </span>
  );
}

// The logged-in attorney: name and staff number come from the login, the rest from the API when available.
function useAttorneyProfile() {
  const { user } = useAuth();
  const { attorneys, getAttorney } = useData();
  const record = getAttorney(user?.staffNumber) || attorneys[0] || null;
  const name = user?.name || (record ? `${record.name} ${record.surname}` : 'Attorney');
  return {
    name,
    initials: initialsOf(name),
    staffNumber: user?.staffNumber || record?.staffNumber || '',
    specialization: record?.specialization || '',
    email: user?.email || record?.email || '',
  };
}

// Tasks that belong to the attorney's own cases, soonest due date first.
function useMyTasks() {
  const { cases, tasks } = useData();
  return useMemo(() => {
    const mine = new Set(cases.map((c) => c.caseNumber));
    return tasks.filter((t) => mine.has(t.caseNumber)).sort(byDueDate);
  }, [cases, tasks]);
}

// Records progress: sends the task back to the API with its new status.
async function saveTaskStatus(task, status) {
  await api.put(`/LegalTasks/${task.id}`, {
    taskName: task.title,
    description: task.description || 'No description',
    dueDate: new Date(task.dueDate).toISOString(),
    status,
    caseId: task.caseId,
  });
}

function Shell({ children }) {
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

/* Task table, used on the dashboard (one case) and on the tasks page (all cases) */
function TaskTable({ rows, showCase, busyId, onStatus }) {
  return (
    <div className="jl-tw">
      <table className="jl-table">
        <thead>
          <tr>
            <th>TASK ID</th>
            <th>TASK</th>
            {showCase && <th>CASE</th>}
            <th>DUE DATE</th>
            <th>STATUS</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td colSpan={showCase ? 6 : 5} className="jl-empty">
                No tasks to show.
              </td>
            </tr>
          )}
          {rows.map((t) => (
            <tr key={t.id}>
              <td>
                <span className="jl-tid jl-mono">{t.taskId}</span>
              </td>
              <td>
                <b>{t.title}</b>
                {t.description && <small>{t.description}</small>}
              </td>
              {showCase && <td>{t.caseNumber || '—'}</td>}
              <td style={{ whiteSpace: 'nowrap' }}>
                {t.dueDate ? formatDate(t.dueDate) : '—'}
                {isOverdue(t) && <small className="jl-tone-warn">Overdue</small>}
              </td>
              <td>
                <select
                  className={`jl-pick ${t.status.replace(/\s/g, '').toLowerCase()}`}
                  value={t.status}
                  disabled={busyId === t.id}
                  aria-label={`Status of ${t.taskId}`}
                  onChange={(e) => onStatus(t, e.target.value)}
                >
                  {TASK_STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </td>
              <td>
                <Link className="jl-btn sm" to={`/attorney/tasks/edit/${t.id}`}>
                  <Icon name="edit" size={13} /> Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Shared by both pages: change a task's status and refresh the data.
function useStatusChange() {
  const { refreshData } = useData();
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const onStatus = async (task, status) => {
    setBusyId(task.id);
    setError('');
    try {
      await saveTaskStatus(task, status);
      await refreshData();
    } catch (err) {
      setError(
        err.response?.status === 403
          ? 'You can only update tasks on your own cases.'
          : `Could not update the task: ${err.message}`
      );
    } finally {
      setBusyId(null);
    }
  };

  return { busyId, error, onStatus };
}

/* ================= New case window ================= */
const NO_ID = '00000000-0000-0000-0000-000000000000';
const CASE_STATUSES = ['Open', 'In Progress', 'Pending Hearing', 'Review'];
const todayStr = () => new Date().toISOString().slice(0, 10);

function CaseModal({ onHide, onSaved, startNumber }) {
  const [clients, setClients] = useState([]);
  const [caseTypes, setCaseTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    caseNumber: startNumber,
    caseName: '',
    caseDescription: '',
    dateOpened: todayStr(),
    caseStatus: 'Open',
    caseTypeId: '',
    clientId: '',
  });
  const [otherType, setOtherType] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Load the client and case type lists straight from the API
  useEffect(() => {
    let alive = true;
    Promise.allSettled([api.get('/Clients'), api.get('/CaseTypes')]).then(([c, t]) => {
      if (!alive) return;
      const cl = c.status === 'fulfilled' && Array.isArray(c.value.data) ? c.value.data : [];
      const ty = t.status === 'fulfilled' && Array.isArray(t.value.data) ? t.value.data : [];
      setClients(cl);
      setCaseTypes(ty);
      setForm((f) => ({ ...f, clientId: cl[0] ? cl[0].id : '', caseTypeId: ty[0] ? ty[0].id : '' }));
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, []);

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  const selectedType = caseTypes.find((t) => t.id === form.caseTypeId);
  const isOther = !!selectedType && selectedType.name === 'Other';
  const missingLists = !loading && (clients.length === 0 || caseTypes.length === 0);

  const save = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.caseNumber.trim() || !form.caseName.trim() || !form.clientId || !form.caseTypeId || !form.dateOpened) {
      setError('Case number, case name, client, case type and date opened are required.');
      return;
    }
    if (isOther && !otherType.trim()) {
      setError('Please say what the other case type is.');
      return;
    }
    setSaving(true);
    try {
      const res = await api.post('/Cases', {
        caseNumber: form.caseNumber.trim(),
        caseName: form.caseName.trim(),
        caseDescription: (isOther ? `[Other: ${otherType.trim()}] ` : '') + form.caseDescription.trim(),
        dateOpened: form.dateOpened,
        caseStatus: form.caseStatus,
        caseTypeId: form.caseTypeId,
        clientId: form.clientId,
        attorneyId: NO_ID, // the API assigns the logged-in attorney
      });
      await onSaved(`Case ${(res.data && res.data.caseNumber) || form.caseNumber} was created and saved.`);
      onHide();
    } catch (err) {
      const d = err.response && err.response.data;
      setError(
        (d && (d.title || d.message)) ||
          `Could not save the case (error ${err.response ? err.response.status : 'no connection'}).`
      );
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onHide} centered>
      <Form onSubmit={save}>
        <Modal.Header closeButton>
          <Modal.Title>New Case</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {loading && <Alert variant="light">Loading clients and case types...</Alert>}
          {missingLists && (
            <Alert variant="warning">
              No clients or case types are available yet. Ask the administrator to add a client first.
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Case number</Form.Label>
            <Form.Control value={form.caseNumber} onChange={set('caseNumber')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Case name</Form.Label>
            <Form.Control value={form.caseName} onChange={set('caseName')} placeholder="e.g. State v. Mokoena" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Client</Form.Label>
            <Form.Select value={form.clientId} onChange={set('clientId')}>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.clientNumber} — {c.firstName} {c.surname}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Case type</Form.Label>
            <Form.Select value={form.caseTypeId} onChange={set('caseTypeId')}>
              {caseTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </Form.Select>
            {isOther && (
              <Form.Control
                className="mt-2"
                placeholder="Specify the other case type"
                value={otherType}
                onChange={(e) => setOtherType(e.target.value)}
              />
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={form.caseDescription} onChange={set('caseDescription')} />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date opened</Form.Label>
            <Form.Control type="date" value={form.dateOpened} onChange={set('dateOpened')} />
          </Form.Group>

          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select value={form.caseStatus} onChange={set('caseStatus')}>
              {CASE_STATUSES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={saving}>
            Cancel
          </Button>
          <Button variant="dark" type="submit" disabled={saving || loading || missingLists}>
            {saving ? 'Saving...' : 'Create case'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

/* ================= Page 1: Attorney dashboard ================= */
export default function AttorneyDashboard({ casesOnly = false }) {
  const { cases, getClient, maxCaseload, refreshData, nextCaseNumber } = useData();
  const [showNewCase, setShowNewCase] = useState(false);
  const [notice, setNotice] = useState('');
  const startNumber =
    typeof nextCaseNumber === 'function'
      ? nextCaseNumber()
      : `CASE-${new Date().getFullYear()}-${String(cases.length + 1).padStart(3, '0')}`;
  const profile = useAttorneyProfile();
  const myTasks = useMyTasks();
  const { busyId, error, onStatus } = useStatusChange();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [selectedId, setSelectedId] = useState(null);

  const statuses = useMemo(
    () => ['All', ...Array.from(new Set(cases.map((c) => c.status).filter(Boolean)))],
    [cases]
  );
  const countFor = (s) => (s === 'All' ? cases.length : cases.filter((c) => c.status === s).length);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return cases.filter(
      (c) =>
        (filter === 'All' || c.status === filter) &&
        `${c.caseNumber} ${c.title} ${c.type}`.toLowerCase().includes(q)
    );
  }, [cases, query, filter]);

  const selected = cases.find((c) => c.id === selectedId) || visible[0] || cases[0] || null;
  const client = selected ? getClient(selected.clientNumber) || getClient(selected.clientId) : null;
  const caseTasks = selected ? myTasks.filter((t) => t.caseNumber === selected.caseNumber) : [];

  const activeCases = cases.filter((c) => c.status !== 'Closed').length;
  const capacity = Math.min(100, Math.round((activeCases / maxCaseload) * 100));
  const openTasks = myTasks.filter((t) => t.status !== 'Complete').length;
  const overdueTasks = myTasks.filter(isOverdue).length;
  const doneTasks = myTasks.filter((t) => t.status === 'Complete').length;

  return (
    <Shell>
      {notice && (
        <div className="jl-ok" role="status">
          {notice}
          <button type="button" aria-label="Dismiss" onClick={() => setNotice('')}>
            ×
          </button>
        </div>
      )}
      {showNewCase && (
        <CaseModal
          startNumber={startNumber}
          onHide={() => setShowNewCase(false)}
          onSaved={async (message) => {
            await refreshData();
            setNotice(message);
          }}
        />
      )}
      {casesOnly ? (
        <div className="jl-ph">
          <div>
            <div className="jl-lbl jl-orange">LEGAL OPERATIONS • CASES &amp; DOCKETS</div>
            <h1>My Cases</h1>
          </div>
          <span className="jl-total">{cases.length} Total</span>
        </div>
      ) : (
        <section className="jl-prof">
          <div className="jl-prof-l">
            <div className="jl-ava">{profile.initials}</div>
            <div>
              <h1>
                {profile.name}
                {profile.staffNumber && <span className="jl-idchip">ID #{profile.staffNumber}</span>}
                <span className="jl-role">Attorney</span>
              </h1>
              {profile.specialization && <div className="jl-sub">{profile.specialization}</div>}
              {profile.email && (
                <div className="jl-sub2">
                  <span>
                    <Icon name="mail" size={13} /> {profile.email}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="jl-kpis">
            <div className="jl-kpi">
              <div className="jl-kl">
                <Icon name="briefcase" size={12} /> ACTIVE CASES
              </div>
              <div className="jl-kv">
                <b>{activeCases}</b> / {maxCaseload} Max
              </div>
              <div className="jl-bar">
                <i style={{ width: `${capacity}%` }} />
              </div>
              <div className="jl-km">{capacity}% Caseload cap</div>
            </div>
            <div className="jl-kpi">
              <div className="jl-kl">
                <Icon name="file" size={12} /> OPEN TASKS
              </div>
              <div className="jl-kv">
                <b>{openTasks}</b>
              </div>
              <div className="jl-km">Across {cases.length} cases</div>
            </div>
            <div className="jl-kpi">
              <div className="jl-kl">
                <Icon name="clock" size={12} /> OVERDUE
              </div>
              <div className="jl-kv">
                <b className={overdueTasks > 0 ? 'jl-orange' : ''}>{overdueTasks}</b>
              </div>
              <div className="jl-km">{overdueTasks > 0 ? 'Past the due date' : 'Nothing overdue'}</div>
            </div>
            <div className="jl-kpi">
              <div className="jl-kl">
                <Icon name="checkcircle" size={12} /> COMPLETED
              </div>
              <div className="jl-kv">
                <b>{doneTasks}</b> of {myTasks.length}
              </div>
              <div className="jl-km">Tasks finished</div>
            </div>
          </div>
        </section>
      )}

      <div className="jl-grid">
        {/* Left: my assigned cases */}
        <div>
          <section className="jl-card">
            <div className="jl-hd">
              <div>
                <h2 className="jl-h2">My Assigned Cases</h2>
                <div className="jl-muted">Cases assigned to you</div>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span className="jl-total">{cases.length} Total</span>
                <button type="button" className="jl-btn dark sm" onClick={() => setShowNewCase(true)}>
                  <Icon name="plus" size={13} /> New Case
                </button>
              </div>
            </div>

            <div className="jl-csearch">
              <Icon name="search" size={14} />
              <input
                placeholder="Search case number, title or type..."
                aria-label="Search my cases"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="jl-chips" role="group" aria-label="Filter cases by status">
              {statuses.map((f) => (
                <button
                  key={f}
                  type="button"
                  className={`jl-chip${filter === f ? ' on' : ''}`}
                  onClick={() => setFilter(f)}
                >
                  {f} ({countFor(f)})
                </button>
              ))}
            </div>

            <div className="jl-list">
              {cases.length === 0 && (
                <div className="jl-empty">No cases have been assigned to you yet.</div>
              )}
              {cases.length > 0 && visible.length === 0 && (
                <div className="jl-empty">No cases match your search.</div>
              )}
              {visible.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`jl-ci${selected && c.id === selected.id ? ' on' : ''}`}
                  onClick={() => setSelectedId(c.id)}
                >
                  <div className="jl-ci1">
                    <span className="jl-ref">{c.caseNumber}</span>
                    <span className="jl-tag">{c.type}</span>
                    <CaseStatusPill label={c.status} className="jl-ml" />
                  </div>
                  <div className="jl-ci2">{c.title}</div>
                  <div className="jl-ci3">
                    <span>
                      <Icon name="user" size={12} /> {c.clientNumber || 'Client'}
                    </span>
                    <span>
                      <Icon name="calendar" size={12} /> {c.dateOpened ? formatDate(c.dateOpened) : '—'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Right: selected case */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {!selected && (
            <section className="jl-card">
              <div className="jl-empty">
                Select a case to see its details, the client and its tasks. Cases appear here once an
                administrator assigns them to you.
              </div>
            </section>
          )}

          {selected && (
            <>
              <section className="jl-card">
                <div className="jl-dh">
                  <div>
                    <div className="jl-dref">
                      <span>{selected.caseNumber}</span>
                      <CaseStatusPill label={selected.status} />
                    </div>
                    <h2>{selected.title}</h2>
                    <div className="jl-muted">
                      {selected.type} — Opened {selected.dateOpened ? formatDate(selected.dateOpened) : '—'}
                    </div>
                  </div>
                  <div className="jl-btns">
                    <Link to={`/attorney/tasks/new?case=${encodeURIComponent(selected.caseNumber)}`} className="jl-btn dark">
                      <Icon name="plus" size={14} /> Log Activity / Add Task
                    </Link>
                  </div>
                </div>
              </section>

              <section className="jl-card">
                <div className="jl-hd">
                  <h2 className="jl-h2 ic">
                    <Icon name="user" size={16} /> Client Information
                  </h2>
                  {selected.clientNumber && <span className="jl-total">{selected.clientNumber}</span>}
                </div>
                {client ? (
                  <div className="jl-cl-i" style={{ marginTop: 12 }}>
                    <div className="jl-cl-av">{initialsOf(`${client.firstName} ${client.surname}`)}</div>
                    <div style={{ minWidth: 0 }}>
                      <b>
                        {client.firstName} {client.surname}
                      </b>
                      <div className="jl-cl-l">
                        <span>
                          <Icon name="briefcase" size={12} /> ID / Passport:{' '}
                          <span className="jl-mono">{client.idNumber || '—'}</span>
                        </span>
                        <span>
                          <Icon name="user" size={12} /> {client.gender || '—'}
                          {client.dateOfBirth ? ` • Born ${formatDate(client.dateOfBirth)}` : ''}
                        </span>
                        <span>
                          <Icon name="mail" size={12} />
                          {client.email ? <a href={`mailto:${client.email}`}>{client.email}</a> : '—'}
                        </span>
                        <span>
                          <Icon name="phone" size={12} /> {client.phone || '—'}
                        </span>
                        <span style={{ whiteSpace: 'pre-line' }}>
                          <Icon name="pin" size={12} /> {client.address || '—'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="jl-empty">Client details are not available for this case.</div>
                )}
              </section>

              <section className="jl-card">
                <h2 className="jl-h2 ic">
                  <Icon name="scales" size={16} /> Case Summary
                </h2>
                <p className="jl-sum">{selected.description || 'No case summary has been captured for this case yet.'}</p>
              </section>

              <section className="jl-card">
                <div className="jl-hd">
                  <h2 className="jl-h2 ic">
                    <Icon name="check" size={16} /> Legal Tasks &amp; Activity
                  </h2>
                  <span className="jl-total">{caseTasks.length} Tasks</span>
                </div>
                {error && <div className="jl-alert">{error}</div>}
                <TaskTable rows={caseTasks} showCase={false} busyId={busyId} onStatus={onStatus} />
                <Link to="/attorney/tasks" className="jl-more">
                  Open all my tasks <Icon name="arrow" size={12} />
                </Link>
              </section>
            </>
          )}
        </div>
      </div>
    </Shell>
  );
}

/* ================= Page 2: Legal Tasks & Activities ================= */
export function LegalTasksPage() {
  const { cases } = useData();
  const myTasks = useMyTasks();
  const { busyId, error, onStatus } = useStatusChange();
  const location = useLocation();
  const navigate = useNavigate();

  const [message, setMessage] = useState(location.state?.message || '');
  const [filter, setFilter] = useState('All');
  const [caseFilter, setCaseFilter] = useState('All');
  const [search, setSearch] = useState('');

  // The form sends back a message once; clear it from the browser history state
  useEffect(() => {
    if (location.state) navigate(location.pathname, { replace: true, state: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const term = search.trim().toLowerCase();
  const rows = myTasks.filter((t) => {
    if (filter !== 'All' && t.status !== filter) return false;
    if (caseFilter !== 'All' && t.caseNumber !== caseFilter) return false;
    if (term && !`${t.taskId} ${t.title} ${t.description} ${t.caseNumber}`.toLowerCase().includes(term)) return false;
    return true;
  });

  const done = myTasks.filter((t) => t.status === 'Complete').length;
  const pct = myTasks.length === 0 ? 0 : Math.round((done / myTasks.length) * 100);
  const countFor = (s) => (s === 'All' ? myTasks.length : myTasks.filter((t) => t.status === s).length);

  return (
    <Shell>
      <section className="jl-card">
        <div className="jl-ph">
          <div>
            <div className="jl-lbl jl-orange">LEGAL OPERATIONS • TASKS &amp; ACTIVITIES</div>
            <h1>Legal Activity &amp; Task Tracker</h1>
          </div>
          <div className="jl-fin">
            <div>
              <span>TASK COMPLETION</span>
              <b>{pct}%</b>
            </div>
            <div className="jl-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="jl-muted">
              {done} of {myTasks.length} tasks completed
            </div>
          </div>
        </div>

        {message && (
          <div className="jl-ok" role="status">
            {message}
            <button type="button" aria-label="Dismiss" onClick={() => setMessage('')}>
              ×
            </button>
          </div>
        )}
        {error && <div className="jl-alert">{error}</div>}

        <div className="jl-bar-tools">
          <div className="jl-chips" role="group" aria-label="Filter tasks by status">
            {['All', ...TASK_STATUSES].map((s) => (
              <button key={s} type="button" className={`jl-chip${filter === s ? ' on' : ''}`} onClick={() => setFilter(s)}>
                {s === 'All' ? 'All Tasks' : s} ({countFor(s)})
              </button>
            ))}
          </div>
          <Link to="/attorney/tasks/new" className="jl-btn dark">
            <Icon name="plus" size={14} /> Add Legal Task
          </Link>
        </div>

        <div className="jl-filters">
          <input
            className="jl-field"
            placeholder="Search by task or case..."
            aria-label="Search tasks"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select className="jl-field" value={caseFilter} onChange={(e) => setCaseFilter(e.target.value)} aria-label="Filter by case">
            <option value="All">All my cases</option>
            {cases.map((c) => (
              <option key={c.id} value={c.caseNumber}>
                {c.caseNumber} - {c.title}
              </option>
            ))}
          </select>
        </div>

        <TaskTable rows={rows} showCase busyId={busyId} onStatus={onStatus} />

        <div className="jl-notice">
          <b>Recording activity</b>
          Use the status list on each task to record progress, <i>Edit</i> to change the details, or <i>Add Legal Task</i> to
          log new work on one of your cases.
        </div>
      </section>
    </Shell>
  );
}

/* ================= Page 3: My Cases (same case workspace, no profile header) ================= */
export function MyCasesPage(props) {
  return <AttorneyDashboard {...props} casesOnly />;
}
