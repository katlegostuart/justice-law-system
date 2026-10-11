export const TASK_STATUSES = ['Not Started', 'In Progress', 'Complete'];

export const todayIso = () => new Date().toISOString().slice(0, 10);

export const isOverdue = (t) => t.status !== 'Complete' && !!t.dueDate && t.dueDate < todayIso();

export const nextTaskId = (tasks) => {
  const highest = tasks.reduce((max, t) => {
    const n = parseInt(String(t.taskId || '').replace('TSK-', ''), 10);
    return Number.isNaN(n) ? max : Math.max(max, n);
  }, 0);
  return 'TSK-' + String(highest + 1).padStart(4, '0');
};