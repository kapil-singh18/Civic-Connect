import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, Clock } from 'lucide-react';
import api from '../services/api.js';

export default function NotificationPanel({ open, notifications = [], onOpenIssue }) {
  const queryClient = useQueryClient();
  const markRead = useMutation({
    mutationFn: () => api.put('/notifications/read'),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] })
  });

  if (!open) return null;

  return (
    <aside className="notification-panel">
      <div className="notification-panel-header">
        <div>
          <p className="eyebrow">Live Updates</p>
          <h2>Notifications</h2>
        </div>
        <button className="secondary-button small" type="button" onClick={() => markRead.mutate()}>Mark Read</button>
      </div>
      <div className="notification-list">
        {notifications.map((item) => (
          <button
            className={`notification-card ${item.read ? '' : 'unread'}`}
            key={item._id}
            type="button"
            onClick={() => item.issueId && onOpenIssue(item.issueId._id || item.issueId)}
          >
            <div className="notification-icon"><Bell size={16} /></div>
            <div>
              <strong>{item.title || 'Notification'}</strong>
              <p>{item.message}</p>
              {item.issueId?.title && <span>{item.issueId.title} - {item.issueId.status}</span>}
              <small><Clock size={13} /> {new Date(item.createdAt).toLocaleString()}</small>
            </div>
          </button>
        ))}
        {notifications.length === 0 && <p className="empty-state">No notifications yet.</p>}
      </div>
    </aside>
  );
}
