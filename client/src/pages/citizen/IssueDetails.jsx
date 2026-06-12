import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import Badge from '../../components/Badge.jsx';
import api from '../../services/api.js';
import { priorityClass, statusClass } from '../../utils/constants.js';

export default function IssueDetails() {
  const { id } = useParams();
  const issue = useQuery({ queryKey: ['issue', id], queryFn: async () => (await api.get(`/issues/${id}`)).data });

  if (issue.isLoading) return <p className="loading">Loading issue...</p>;
  const data = issue.data;

  return (
    <section className="section-band">
      <div className="details-header">
        <div>
          <p className="eyebrow">{data.category}</p>
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>
        <div className="row-badges">
          <Badge className={priorityClass(data.priority)}>{data.priority}</Badge>
          <Badge className={statusClass(data.status)}>{data.status}</Badge>
        </div>
      </div>
      <div className="details-grid">
        <div><strong>Location</strong><span>{data.location.address}</span></div>
        <div><strong>Department</strong><span>{data.assignedDepartment}</span></div>
        <div><strong>Reported</strong><span>{new Date(data.createdAt).toLocaleString()}</span></div>
      </div>
      <ol className="timeline">
        {data.progress.map((step) => (
          <li key={step._id}>
            <span />
            <div>
              <h3>{step.step}</h3>
              <p>{step.comments || 'No comments added.'}</p>
              <small>{new Date(step.createdAt).toLocaleString()}</small>
            </div>
          </li>
        ))}
      </ol>
      <div className="reply-list standalone">
        <h3>Admin Replies</h3>
        {(data.replies || []).map((item) => (
          <article className="reply-item" key={item._id}>
            <p>{item.message}</p>
            <small>{item.sentBy?.name || 'Admin'} - {new Date(item.createdAt).toLocaleString()}</small>
          </article>
        ))}
        {(data.replies || []).length === 0 && <p className="empty-state">No admin replies yet.</p>}
      </div>
    </section>
  );
}
