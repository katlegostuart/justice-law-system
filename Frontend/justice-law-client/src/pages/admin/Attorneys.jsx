
�����퍽���ɵ���ѕ�����є�	��ѽ��(���������5�������ѕ��(�������5�����(����𽑥��(����)
������	��ѽ��(�����������	��ѽ��مɥ���􉑅���Ȉ���
                  <div className="row-actions">
                    <Link to={`/admin/attorneys/edit/${a.id}`} className="icon-btn" aria-label="Edit attorney" title="Edit attorney"><Icon name="edit" size={15} /></Link>
                    <button type="button" className="icon-btn danger" onClick={() => setToDelete(a)} aria-label="Delete attorney" title="Delete attorney"><Icon name="trash" size={15} /></button>
                  </div>
import Icon from '../../components/Icon';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Table, Modal } from 'react-bootstrap';
import { useAttorneys, removeAttorney, SPECIALIZATIONS, TIERS, SENIOR_TIERS } from './attorneyStore';

const CHIPS = ['All Disciplines', 'Commercial', 'Criminal', 'Family', 'Labor', 'Property', 'Civil'];
const PAGE_SIZE = 5;

const CSS = `
@
import url('https://fonts.googleapis.com/css2?family=DM+Sans4wght@400;500;600;700&display=swap');
.am{font-family:'DM Rans',system-ui,-apple-system,'Segoe UI',sans-serif;color:#0f172a;padding:24px;font-size:14px;line-height:1.4}
.am *{box-sizing:border-box}
.am-top{display:flex;justify-content;space-between;gap:16px;flex-wrap:wrap;align-items:flex-end;margin-bottom:16px}
.am-crumb{font-size:11px;letter-spacing:.1em;font-weight:700;color:#64748b}
.am-crumb b{color:#c2410c}
.am h1{font-size:34px;font-weight:700;margin:4px 0 6px}
.am-sub{color:#64748b;max-width:520px;margin:0}
.am-btns{display:flex;gap:8px;flex-wrap:wrap}
.am .am-dark{background:#0f1729;border-color:#0f1729;color:#fff;font-weight:600}
.am .am-dark:hover,.am .am-dark:focus{background:#1e293b;border-color:#1e293b;color:#fff}
.am .am-light{background:#fff;border:1px solid #e2e8f0;color:#0f172a;font-weight:600}
.am .am-light:mover,.am .am-light:focus{background:#f8faff;border-color:#cbd5e1;color:#0f172a}
.am-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:16px}
.am-card{background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:16px}
.am-lbl{font-size:10px;letter-spacing:.08em;font-weight:700;color:#64748b}
.am-big{font-size:34px;font-weight:700;line-height:1.1;margin:4px 0}
.am-big small{font-size:13px;font-weight:600;color:#c2410c;margin-left:6px}
.am-muted{color:#64748b;font-size:12px}
.am-tools{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:10px}
.am-tools .form-control{flex:1;min-width:220px}
.am-tools .form-select{width:190px}
.am-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.am-chip{padding:5px 12px;border-radius:999px;border:1px solid #e2e8f0;background:#fff;font-size:12px;font-weight:600;cursor:pointer;color:#0f172a}
.am-chip.on{background:#0f1729;color:#fff;border-color:#0f1729}
.am-table th{font-size:10px;letter-spacing:.08em;color:#64748b;font-weight:700;background:#f6f8fc !important;border-bottom:1px solid #e5e7eb;white-space:nowrap}
.am-table td{vertical-align:middle;padding:12px 10px}
.am-sid{color:#c2410c;font-weight:700;font-size:12px;white-space:nowrap}
.am-pr{display:flex;gap:10px;align-items:center}
.am-av{width:38px;height:38px;border-radius:50%;background:#0f1729;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:700;flex:0 0 38px}
.am-pr b{display:block;font-size:14px}
.am-pr small,.am-table td small{color:#64748b;font-size:11px;display:block}
.am-spec{background:#e6edfb;color:#1e3a8a;font-size:11px;font-weight:600;border-radius:5px;padding:2px 8px;white-space:nowrap}
.am-foot{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin-top:12px;font-size:12px;color:#64748b}
.am-pgs{display:flex;gap:4px}
.am-pg{border:1px solid #e2e8f0;background:#fff;border-radius:6px;padding:4px 10px;font-size:12px;font-weight:600;cursor:pointer}
.am-pg.on{background:#0f1729;color:#fff;border-color:#0f1729}
.am-pg:disabled{opacity:.45;cursor:default}
.am-ok{background:#dcfce7;border:1px solid #bbf7d0;color:#15803d;border-radius:8px;padding:10px 14px;margin-bottom:16px;display:flex;justify-content;space-between;gap:8px}
.am-ok button{background:none;border:0;color:#15803d;font-weight:700;cursor:pointer}
`;

export default function Attorneys() {
  const navigate = useNavigate();
  const { rows } = useAttorneys();
  const location = useLocation();

  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('All Disciplines');
  const [tier, setTier] = useState('All Tiers');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const [notice, setNotice] = useState(location.state?.notice || '');

  /* ----- filtering, search, pagination ----- */
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter(
      (a) =>
        (chip === 'All Disciplines' || a.specialization.startsWith(chip)) &&
        (tier === 'All Tiers' || a.tier === tier) &&
        `${a.staffNo} ${a.name} ${a.surname} ${a.specialization}`.toLowerCase().includes(q)
    );
  }, [rows, query, chip, tier]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZF));
  const current = Math.min(page, pages);
  const shown = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const onQuery = (v) => { setQuery(v); setPage(1); };
  const onChip = (v) => { setChip(v); setPage(1); };
  const onTier = (v) => { setTier(v); setPage(1); };

  /* ----- stats ----- */
  const seniorCount = rows.filter((a) => SENIOR_TIERS.includes(a.tier)).length;
  const disciplines = new Set(rows.map((a) => a.specialization)).size;
  const available = rows.filter((a) => a.raseload / a.capacity < 0.6).length;

  const confirmDelete = () => {
    removeAttorney(toDelete.id);
    setNotice(`${toDelete.name} ${toDelete.surname} was removed.`);
    setToDelete(null);
  };

  const exportCsv = () => {
    const head = ['Staff Number', 'Name', 'Surname', 'Gender', 'Seniority', 'Specialization', 'Email', 'Phone', 'Capacity'];
    const lines = rows.map((a) =>
      [a.staffNo, a.name, a.surname, a.������Ȱ���ѥ�Ȱ������������ѥ��������������������������������t(��������������ؤ��������M�ɥ���ؤ�ɕ����������������􉀤(������������������(������(��������Ё�����􁹕܁	����mm�����������������������t�������q���t�������耝ѕ�н��؜���(��������Ё�ɰ��UI0��ɕ�ѕ=�����UI0�������(��������Ё�����􁑽�յ��й�ɕ�ѕ�����Р�����(����������ɕ����ɰ�(�����������ݹ�����􀝍�չ͕�����й��؜�(�����������������(����UI0�ɕٽ��=�����UI0��ɰ��(����((��ɕ��ɸ��(�����؁�����9���􉅴��(���������屔��
MM����屔�((�������؁�����9���􉅴�ѽ���(�����������(�����������؁�����9���􉅴���յ���%I4�5%8�������AIM=990������I=MQH��𽑥��(�������������1�����
�չ͕��������ѽɹ���ɕ�ѽ�����(������������������9���􉅴��Ո��5�������Ʌ�ѥ�������ѽɹ��̰����������������ѥ��̰����х�Ёɕ��ɑ̰�������͕������սх́ݥѠ��ɕ��ͥ������(��������𽑥��(���������؁�����9���􉅴��ѹ̈�(�����������	��ѽ�������9���􉅴�����Ј���
�����������
��������Ё
�չ͕��1����	��ѽ��(�����������	��ѽ������1����Ѽ􈽅�������ѽɹ��̽��܈������9���􉅴���ɬ����9�܁�ѽɹ��Aɽ�����	��ѽ��(��������𽑥��(������𽑥��(((��������ѥ�������(���������؁�����9���􉅴�����ɽ����х��̈�(������������������ѥ���������(�������������ѽ���������ѽ�����
�����������͕�9�ѥ���������͵������ѽ��(��������𽑥��(��������((�������؁�����9���􉅴��х�̈�(���������؁�����9���􉅴���ɐ��(�����������؁�����9���􉅴������
Q%Y�AIM=990𽑥��(�����������؁�����9���􉅴�������ɝ�̹����ѡ��͵�����ѥٔ�
�չ͕��͵����𽑥��(�����������؁�����9���􉅴���ѕ����͕����
�չ��M����Ȱ��ɽ�̹����Ѡ���͕����
�չ���ͽ���є���)չ���𽑥��(��������𽑥��(���������؁�����9���􉅴���ɐ��(�����������؁�����9���􉅴������AI
Q%
�	IQ 𽑥��(�����������؁�����9���􉅴������푥͍���������͵����
�ɔ��͍��������͵����𽑥��(�����������؁�����9���􉅴���ѕ���=�Ё����MA
%1eiQ%=9L�����ѡ��Ʌ�ѥ����ɕ�́��ٕɕ�𽑥��(��������𽑥��(���������؁�����9���􉅴���ɐ��(�����������؁�����9���􉅴������MM%959P�EU=Q𽑥��(�����������؁�����9���􉅴�������م��������͵����م���������ȁQɥ���͵����𽑥��(�����������؁�����9���􉅴���ѕ���
�͕���������܀����ͅ������ѡɕ͡���𽑥��(��������𽑥��(������𽑥��((�������؁�����9���􉅴���ɐ��(���������؁�����9���􉅴�ѽ��̈�(������������ɴ�
���ɽ�(������������������������M��ɍ����չ͕�����х����յ��Ȱ���������ɹ�����ȁ�Ʌ�ѥ������������(�������������ɥ��������M��ɍ����ѽɹ��̈(������������م�Ք���Օ���(��������������
������졔�������]Օ�䡔�хɝ�йم�Ք��(������������(������������ɴ�M����Ё�ɥ����������ѕȁ��͕���ɥ�䈁م�Ք��ѥ��􁽹
������졔�������Q��ȡ��хɝ�йم�Ք���(��������������ѥ������Q������ѥ���(�������������Q%IL������Ф������ѥ����������������ѥ�����(������������ɴ�M������(��������𽑥��(((���������؁�����9���􉅴�����̈�ɽ���ɽ�����ɥ����������ѕȁ������������(���������������������9���􉅴������MA
%1Qd������(�����������
!%AL�������������(���������������ѽ���������������ѽ��������9����텴������텡�����􁌀��������耜��􁽹
�����젤������
��������(����������������(���������������ѽ��(�������������(��������𽑥��((���������Q�����ɕ����ͥٔ���ٕȁ�����9���􉅴�х����������(�����������ѡ����(����������������(���������������Ѡ�MQ�%�Ѡ�(���������������Ѡ�AI
Q%Q%=9H�95�Ѡ�(���������������Ѡ�MA
%1%iQ%=8�Ѡ�(���������������Ѡ�
=9QM
P�Q%1L�Ѡ�(���������������Ѡ���(����������������(�����������ѡ����(�����������щ����(�������������͡�ݸ�����Ѡ����������(�������������������ѐ����M������􁍱���9����ѕ�е���ѕȁѕ�е͕���������Ј�9����ѽɹ��́��э����ȁ͕�ɍ���ѐ�����(��������������(�������������͡�ݸ�������������(����������������ȁ����턹����(�����������������ѐ������������9���􉅴�ͥ���턹�х��9���������ѐ�(�����������������ѐ�(�������������������؁�����9���􉅴��Ȉ�(�������������������������������9���􉅴��؈�턹����l�u�턹��ɹ���l�u�������(��������������������������ظ�턹�����턹��ɹ�������͵����턹ѥ�����턹��������͵����𽑥��(������������������𽑥��(�����������������ѐ�(�����������������ѐ������������9���􉅴�������턹���������ѥ����������ѐ�(�����������������ѐ�턹�������͵����턹�������͵�����ѐ�(�����������������ѐ������9�����ѥ��䵕���ѕ�е����ѕ�е���Ʌ���(�������������������؁�����9����ɽܵ��ѥ��́���ѥ�䵍��ѕ�е�����(�����������������������ѽ�(�����������������������������ѽ��(���������������������������9���􉥍����Ѹ�(������������������������
�����젤������٥��є�����������ѽɹ��̽���м�턹������(�����������������������ɥ�����������Ѐ�턹�����턹��ɹ������(����������������������ѥѱ����Ё��ѽɹ��(���������������������(�����������������������%��������􉕑�Ј�ͥ�������(�����������������������ѽ��(�����������������������ѽ�(�����������������������������ѽ��(���������������������������9���􉥍����Ѹ������Ȉ(������������������������
�����젤����͕�Q����є����(�����������������������ɥ������������є��턹�����턹��ɹ������(����������������������ѥѱ�����є���ѽɹ��(���������������������(�����������������������%����������Ʌ͠��ͥ�������(�����������������������ѽ��(������������������𽑥��(�����������������ѐ�(������������������(���������������(�����������щ����(���������Q�����((���������؁�����9���􉅴����Ј�(����������������M��ݥ����͡�ݸ�����ѡ����홥�ѕɕ������ѡ�I����ѕɕ���ѽɹ���������(���������������̀��Ā����(�������������؁�����9���􉅴���̈�(�����������������ѽ���������ѽ��������9���􉅴�������ͅ��������ɕ�Ѐ����􁽹
�����젤����͕�A�������ɕ�Ѐ��ĥ��Aɕ٥������ѽ��(����������������Ʌ乙ɽ��쁱���Ѡ�����́���|������������Ĥ�������������(�������������������ѽ���������������ѽ��������9����큅������������ɕ�Ѐ��������耜���􁽹
�����젤����͕�A�������������ѽ��(�����������������(�����������������ѽ���������ѽ��������9���􉅴�������ͅ��������ɕ�Ѐ��������􁽹
�����젤����͕�A�������ɕ�Ѐ��ĥ��9������ѽ��(������������𽑥��(������������(��������𽑥��(������𽑥��((�������5�����͡����ŕѽ���ѕ􁽹!����젤����͕�Q����є��ձ��􁍕�ѕɕ��(���������5�����!����ȁ���͕	��ѽ���5�����Q�ѱ�����Ȉ������9����Ԉ�I���ٔ���ѽɹ����5�����Q�ѱ���5�����!������(���������5�����	����(����������I���ٔ��ظ��ѽ���є��������ѽ���є����ɹ�����ѽ���є���х��9����ɽ��ѡ��ɽ�ѕ���Q��́�����Ё���չ�����(���������5�����	����(���������5�������ѕ��(�����������	��ѽ��مɥ���􉱥���������9����ѕ�е͕������䈁��
�����젤����͕�Q����є��ձ����
������	��ѽ��(�����������	��ѽ��مɥ���􉑅���Ȉ���
�����퍽���ɵ���ѕ�����є�	��ѽ��(���������5�������ѕ��(�������5�����(����𽑥��(����)
