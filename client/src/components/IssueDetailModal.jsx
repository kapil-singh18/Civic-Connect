import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, X } from 'lucide-react';
import Badge from './Badge.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { priorityClass, statusClass } from '../utils/constants.js';

export default function IssueDetailModal({ issueId, issue: initialIssue, onClose, onOpenUser }) {
  const [reply, setReply] = useState('Your report is acknowledged. We will inspect it and try to resolve it as soon as possible.');
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const issue = useQuery({
    queryKey: ['issue', issueId],
    queryFn: async () => (await api.get(`/issues/${issueId}`)).data,
    enabled: Boolean(issueId)
  });
  const replyMutation = useMutation({
    mutationFn: async () => (await api.post(`/issues/${issueId}/replies`, { message: reply })).data,
    onSuccess: () => {
      setReply('');
      queryClient.invalidateQueries({ queryKey: ['issue', issueId] });
      queryClient.invalidateQueries({ queryKey: ['admin-issues'] });
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    }
  });

  const data = issue.data || initialIssue;
  if (!issueId || !data) return null;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onClose}>
      <section className="modal-card issue-modal" role="dialog" aria-modal="true" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">{data.category}</p>
            <h2>{data.title}</h2>
          </div>
          <button className="icon-button" type="button" onClick={onClose} title="Close"><X size={19} /></button>
        </div>

        <div className="details-header no-margin">
          <p>{data.description}</p>
          <div className="row-badges">
            <Badge className={priorityClass(data.priority)}>{data.priority}</Badge>
            <Badge className={statusClass(data.status)}>{data.status}</Badge>
          </div>
        </div>

        <div className="details-grid">
          <button className="detail-button" type="button" onClick={() => onOpenUser?.(data.reportedBy)}>
            <strong>Reporter</strong><span>{data.reportedBy?.name || 'Citizen'}</span>
          </button>
          <div><strong>Location</strong><span>{data.location?.address}</span></div>
          <div><strong>Department</strong><span>{data.assignedDepartment}</span></div>
          <div><strong>Reported</strong><span>{new Date(data.createdAt).toLocaleString()}</span></div>
          <div><strong>Coordinates</strong><span>{data.location?.latitude}, {data.location?.longitude}</span></div>
          <div><strong>Issue ID</strong><span>{data._id}</span></div>
        </div>

        {data.imageUrl && <img className="modal-image" src={data.imageUrl} alt={data.title} />}

        {user.role === 'admin' && (
          <form className="reply-box" onSubmit={(event) => { event.preventDefault(); replyMutation.mutate(); }}>
            <label>
              <span><MessageSquare size={16} /> Reply to Citizen</span>
              <textarea rows="3" value={reply} onChange={(event) => setReply(event.target.value)} />
            </label>
            <button className="primary-button" type="submit" disabled={replyMutation.isPending || !reply.trim()}>
              <Send size={17} /> Send Reply
            </button>
          </form>
        )}

        <div className="modal-columns">
          <div>
            <h3>Tracking Timeline</h3>
            <ol className="timeline compact-timeline">
              {(data.progress || []).map((step) => (
                <li key={step._id}>
                  <span />
                  <div>
                    <h3>{step.step}</h3>
                    <p>{step.comments || 'No comments added.'}</p>
                    <small>{new Date(step.createdAt).toLocaleString()} {step.updatedBy?.name ? `by ${step.updatedBy.name}` : ''}</small>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h3>Admin Replies</h3>
            <div className="reply-list">
              {(data.replies || []).map((item) => (
                <article className="reply-item" key={item._id}>
                  <p>{item.message}</p>
                  <small>{item.sentBy?.name || 'Admin'} - {new Date(item.createdAt).toLocaleString()}</small>
                </article>
              ))}
              {(data.replies || []).length === 0 && <p className="empty-state">No admin replies yet.</p>}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
