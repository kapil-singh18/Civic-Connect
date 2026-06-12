import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useOutletContext } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import api from '../../services/api.js';
import { categories, priorities, priorityClass, statuses, statusClass } from '../../utils/constants.js';

export default function IssueManagement() {
  const [filters, setFilters] = useState({ search: '', status: '', category: '', priority: '' });
  const { openIssue, openUser } = useOutletContext();
  const queryClient = useQueryClient();
  const issues = useQuery({ queryKey: ['admin-issues'], queryFn: async () => (await api.get('/issues')).data });
  const mutation = useMutation({
    mutationFn: ({ id, payload }) => api.put(`/issues/${id}`, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-issues'] })
  });
  const progressMutation = useMutation({
    mutationFn: ({ id, step }) => api.put(`/issues/${id}/progress`, { step, comments: `Updated to ${step}.` }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-issues'] })
  });

  const rows = useMemo(() => {
    return (issues.data || []).filter((issue) => {
      const search = filters.search.toLowerCase();
      return (
        (!search || issue.title.toLowerCase().includes(search) || issue.location.address.toLowerCase().includes(search)) &&
        (!filters.status || issue.status === filters.status) &&
        (!filters.category || issue.category === filters.category) &&
        (!filters.priority || issue.priority === filters.priority)
      );
    });
  }, [filters, issues.data]);

  function updateFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="section-band">
      <div className="section-header">
        <div>
          <p className="eyebrow">Operations</p>
          <h2>Issue Management</h2>
        </div>
      </div>
      <div className="filters">
        <input placeholder="Search title or location" value={filters.search} onChange={(e) => updateFilter('search', e.target.value)} />
        <select value={filters.category} onChange={(e) => updateFilter('category', e.target.value)}>
          <option value="">All Categories</option>{categories.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.priority} onChange={(e) => updateFilter('priority', e.target.value)}>
          <option value="">All Priorities</option>{priorities.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}>
          <option value="">All Statuses</option>{statuses.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Issue ID</th><th>Title</th><th>Category</th><th>Priority</th><th>Status</th><th>Location</th><th>Reporter</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {rows.map((issue) => (
              <tr key={issue._id}>
                <td>{issue._id.slice(-6).toUpperCase()}</td>
                <td><button className="link-button" type="button" onClick={() => openIssue(issue._id)}>{issue.title}</button></td>
                <td>{issue.category}</td>
                <td><Badge className={priorityClass(issue.priority)}>{issue.priority}</Badge></td>
                <td><Badge className={statusClass(issue.status)}>{issue.status}</Badge></td>
                <td>{issue.location.address}</td>
                <td><button className="link-button" type="button" onClick={() => openUser(issue.reportedBy)}>{issue.reportedBy?.name}</button></td>
                <td className="action-cell">
                  <select value={issue.priority} onChange={(e) => mutation.mutate({ id: issue._id, payload: { priority: e.target.value } })}>
                    {priorities.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <select value="" onChange={(e) => e.target.value && progressMutation.mutate({ id: issue._id, step: e.target.value })}>
                    <option value="">Progress</option>
                    <option>Acknowledged</option>
                    <option>Assigned</option>
                    <option>Work Started</option>
                    <option>Work Completed</option>
                    <option>Resolved</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
