export const categories = [
  'Road Damage',
  'Potholes',
  'Garbage Collection',
  'Street Light',
  'Drainage',
  'Water Leakage',
  'Traffic Signal',
  'Public Safety',
  'Other'
];

export const priorities = ['Low', 'Medium', 'High', 'Critical'];
export const statuses = ['Pending', 'Acknowledged', 'Assigned', 'In Progress', 'Resolved'];

export function statusClass(status) {
  return {
    Pending: 'bg-slate-100 text-slate-700',
    Acknowledged: 'bg-blue-50 text-civic-blue',
    Assigned: 'bg-indigo-50 text-indigo-700',
    'In Progress': 'bg-amber-50 text-amber-700',
    Resolved: 'bg-green-50 text-civic-green'
  }[status] || 'bg-slate-100 text-slate-700';
}

export function priorityClass(priority) {
  return {
    Low: 'bg-green-50 text-green-700',
    Medium: 'bg-yellow-50 text-yellow-700',
    High: 'bg-orange-50 text-orange-700',
    Critical: 'bg-red-50 text-red-700'
  }[priority] || 'bg-slate-100 text-slate-700';
}
