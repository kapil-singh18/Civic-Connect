import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle2, Clock, FileText, Users } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import MetricCard from '../../components/MetricCard.jsx';
import api from '../../services/api.js';

export default function AdminDashboard() {
  const { openIssue } = useOutletContext();
  const issues = useQuery({ queryKey: ['admin-issues'], queryFn: async () => (await api.get('/issues')).data });
  const analytics = useQuery({ queryKey: ['analytics'], queryFn: async () => (await api.get('/analytics')).data });
  const rows = issues.data || [];

  return (
    <div className="page-stack">
      <section className="metric-grid">
        <MetricCard icon={FileText} label="Total Issues" value={rows.length} />
        <MetricCard icon={Clock} label="Pending" value={rows.filter((i) => i.status === 'Pending').length} tone="amber" />
        <MetricCard icon={CheckCircle2} label="Resolved" value={rows.filter((i) => i.status === 'Resolved').length} tone="green" />
        <MetricCard icon={AlertTriangle} label="Critical Issues" value={rows.filter((i) => i.priority === 'Critical' || i.priority === 'High').length} tone="red" />
        <MetricCard icon={Users} label="Active Citizens" value={analytics.data?.activeCitizens || 0} tone="blue" />
      </section>

      <section className="section-band">
        <div className="section-header">
          <div>
            <p className="eyebrow">Governance Overview</p>
            <h2>Recent Reports</h2>
          </div>
        </div>
        <div className="activity-feed">
          {rows.slice(0, 8).map((issue) => (
            <button className="activity-item clickable" key={issue._id} type="button" onClick={() => openIssue(issue._id)}>
              <strong>{issue.title}</strong>
              <span>{issue.assignedDepartment}</span>
              <span>{issue.reportedBy?.name}</span>
              <small>{new Date(issue.createdAt).toLocaleString()}</small>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
