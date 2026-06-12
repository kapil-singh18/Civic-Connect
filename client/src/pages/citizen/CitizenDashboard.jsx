import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock, FileText, Trophy } from 'lucide-react';
import { Link, useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import MetricCard from '../../components/MetricCard.jsx';
import api from '../../services/api.js';
import { priorityClass, statusClass } from '../../utils/constants.js';

export default function CitizenDashboard() {
  const { openIssue } = useOutletContext();
  const issues = useQuery({ queryKey: ['my-issues'], queryFn: async () => (await api.get('/issues?mine=true')).data });
  const rows = issues.data || [];

  return (
    <div className="page-stack">
      <section className="metric-grid">
        <MetricCard icon={FileText} label="Total Reports" value={rows.length} />
        <MetricCard icon={CheckCircle2} label="Resolved Reports" value={rows.filter((i) => i.status === 'Resolved').length} tone="green" />
        <MetricCard icon={Clock} label="Pending Reports" value={rows.filter((i) => i.status !== 'Resolved').length} tone="amber" />
        <MetricCard icon={Trophy} label="Contribution Points" value={rows.length * 10} tone="green" />
      </section>

      <section className="section-band">
        <div className="section-header">
          <div>
            <p className="eyebrow">Recent Activity</p>
            <h2>Your Reports</h2>
          </div>
          <Link to="/citizen/report" className="primary-link">Report New Issue</Link>
        </div>
        <div className="issue-list">
          {rows.map((issue) => (
            <button className="issue-row clickable" type="button" onClick={() => openIssue(issue._id)} key={issue._id}>
              <div>
                <h3>{issue.title}</h3>
                <p>{issue.location.address}</p>
              </div>
              <div className="row-badges">
                <Badge className={priorityClass(issue.priority)}>{issue.priority}</Badge>
                <Badge className={statusClass(issue.status)}>{issue.status}</Badge>
              </div>
            </button>
          ))}
          {rows.length === 0 && <p className="empty-state">No reports yet.</p>}
        </div>
      </section>
    </div>
  );
}
